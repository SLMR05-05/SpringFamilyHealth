package com.example.backend.service;

import com.example.backend.dto.auth.AuthenticationRequest;
import com.example.backend.dto.auth.IntrospectRequest;
import com.example.backend.dto.auth.LogoutRequest;
import com.example.backend.dto.auth.RefreshRequest;
import com.example.backend.dto.auth.RegisterRequest;
import com.example.backend.dto.response.AuthenticationResponse;
import com.example.backend.dto.response.IntrospectResponse;
import com.example.backend.entity.Doctor;
import com.example.backend.entity.Family;
import com.example.backend.entity.Member;
import com.example.backend.entity.InvalidatedToken;
import com.example.backend.entity.InviteCode;
import com.example.backend.entity.User;
import com.example.backend.exception.AppException;
import com.example.backend.exception.ErrorCode;
import com.example.backend.repository.DoctorRepository;
import com.example.backend.repository.FamilyRepository;
import com.example.backend.repository.InvalidatedTokenRepository;
import com.example.backend.repository.InviteCodeRepository;
import com.example.backend.repository.MemberRepository;
import com.example.backend.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final InvalidatedTokenRepository invalidatedTokenRepository;
    private final PasswordEncoder passwordEncoder;
        // Inject thêm các repository cần thiết cho logic đăng ký
    private final FamilyRepository familyRepository;
    private final MemberRepository memberRepository;
    private final DoctorRepository doctorRepository;
    private final InviteCodeRepository inviteCodeRepository;
    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGN_KEY;

    @NonFinal
    @Value("${jwt.valid-duration:3600}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration:604800}")
    protected long REFRESHABLE_DURATION;

    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        var token = request.getToken();
        boolean isValid = true;
        try { verifyToken(token, false); }
        catch (AppException e) { isValid = false; }
        return IntrospectResponse.builder().valid(isValid).build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // Using email as username
        var user = userRepository.findByEmail(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Check if account is locked
        if (user.getLocked() != null && user.getLocked()) {
            throw new AppException(ErrorCode.ACCOUNT_LOCKED);
        }

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());
        if (!authenticated) throw new AppException(ErrorCode.UNAUTHENTICATED);

        var token = generateToken(user);
        return AuthenticationResponse.builder().token(token).authenticated(true).build();
    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try {
            var signed = verifyToken(request.getToken(), true);
            String jti = signed.getJWTClaimsSet().getJWTID();
            Date expiryTime = signed.getJWTClaimsSet().getExpirationTime();
            invalidatedTokenRepository.save(Objects.requireNonNull(InvalidatedToken.builder().id(jti).expiryTime(expiryTime).build()));
        } catch (Exception e) {
            log.info("Token already expired or invalid");
        }
    }

    public AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        var signed = verifyToken(request.getToken(), true);
        var jti = signed.getJWTClaimsSet().getJWTID();
        var expiryTime = signed.getJWTClaimsSet().getExpirationTime();
        invalidatedTokenRepository.save(Objects.requireNonNull(InvalidatedToken.builder().id(jti).expiryTime(expiryTime).build()));

        var email = signed.getJWTClaimsSet().getSubject();
        var user = userRepository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
        var token = generateToken(user);
        return AuthenticationResponse.builder().token(token).authenticated(true).build();
    }



   // --- LOGIC ĐĂNG KÝ (MỚI) ---

    public AuthenticationResponse register(RegisterRequest request) {
        // 1. Kiểm tra Email đã tồn tại chưa
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được sử dụng!"); // Nên dùng custom exception UserAlreadyExists
        }

        // 2. Tạo User (Bảng user) - Bước chung cho mọi loại tài khoản
        User user = new User();
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setLocked(false); // Mặc định tài khoản active

        // 3. Phân loại xử lý dựa trên Registration Type
        String type = request.getRegistrationType() != null ? request.getRegistrationType().toUpperCase() : "MEMBER";

        switch (type) {
            case "HEAD": // Chủ hộ
                registerHeadOfHousehold(user, request);
                break;
            case "MEMBER": // Thành viên (qua mã mời)
                registerFamilyMember(user, request);
                break;
            case "DOCTOR": // Bác sĩ
                registerDoctor(user, request);
                break;
            default:
                throw new RuntimeException("Loại tài khoản không hợp lệ: " + type);
        }

        // 4. Tạo token để tự động đăng nhập sau khi đăng ký thành công
        var token = generateToken(user);
        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    // Xử lý đăng ký Chủ hộ
    private void registerHeadOfHousehold(User user, RegisterRequest request) {
        user.setRole("USER"); // Role trong bảng user là USER
        User savedUser = userRepository.save(user);

        // Tạo gia đình mới
        Family family = new Family();
        family.setAddress(request.getAddress());
        family.setContactNumber(request.getPhone());
        // family.setDoctorId(null); // Chưa có bác sĩ phụ trách lúc đầu
        Family savedFamily = familyRepository.save(family);
        // Tạo Member với role HEAD
        Member member = new Member();
        member.setMemberId(savedUser.getUserId()); // ID member trùng với User ID (OneToOne)
        member.setFamily(savedFamily);
        member.setRoleInFamily("HEAD");
        member.setRelationship("Chủ hộ");
        // Map ngược lại user để Hibernate hiểu quan hệ (nếu Entity Member có field user)
        member.setUser(savedUser);
        
        // Lưu thông tin bổ sung nếu có trong request
        member.setAddress(request.getAddress());
        member.setPhone(request.getPhone());
        member.setEmail(request.getEmail());

        memberRepository.save(member);
    }

    // Xử lý đăng ký Thành viên (Người thân)
    private void registerFamilyMember(User user, RegisterRequest request) {
        user.setRole("USER");
        User savedUser = userRepository.save(user);

        // Tìm gia đình thông qua mã mời
        InviteCode invite = inviteCodeRepository.findByCode(request.getInviteCode())
                .orElseThrow(() -> new RuntimeException("Mã mời không hợp lệ hoặc không tồn tại!"));

        // Kiểm tra mã mời hết hạn (nếu cần)
        // if (invite.getExpiredAt() != null && invite.getExpiredAt().before(new Date())) { ... }

        // Tạo Member với role MEMBER thuộc gia đình tìm được
        Member member = new Member();
        member.setMemberId(savedUser.getUserId());
        member.setFamily(invite.getFamily()); // Link vào family của mã mời
        member.setRoleInFamily("MEMBER");
        member.setRelationship("Thành viên"); // Sẽ cập nhật cụ thể sau
        member.setUser(savedUser);
        
        member.setPhone(request.getPhone());
        member.setEmail(request.getEmail());

        memberRepository.save(member);
    }

    // Xử lý đăng ký Bác sĩ
    private void registerDoctor(User user, RegisterRequest request) {
        user.setRole("DOCTOR");
        User savedUser = userRepository.save(user);

        // Tạo Doctor
        Doctor doctor = new Doctor();
        doctor.setDoctorId(savedUser.getUserId());
        doctor.setCertificateNumber(request.getCertificateNumber());
        doctor.setDescription(request.getSpecialization()); // Lưu chuyên khoa vào description
        doctor.setUser(savedUser);

        doctorRepository.save(doctor);
    }




    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGN_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = isRefresh
                ? Date.from(signedJWT.getJWTClaimsSet().getIssueTime().toInstant().plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS))
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        boolean verified = signedJWT.verify(verifier);
        if (!(verified && expiryTime.after(new Date()))) throw new AppException(ErrorCode.UNAUTHENTICATED);
        if (invalidatedTokenRepository.existsById(Objects.requireNonNull(signedJWT.getJWTClaimsSet().getJWTID()))) throw new AppException(ErrorCode.UNAUTHENTICATED);
        return signedJWT;
    }

    private String generateToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issuer("khangdnm.com")
                .issueTime(new Date())
                .expirationTime(Date.from(Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS)))
                .jwtID(UUID.randomUUID().toString())
                .claim("userId", user.getUserId())
                .claim("scope", buildScope(user))
                .build();

        JWSObject jwsObject = new JWSObject(header, new Payload(claims.toJSONObject()));
        try {
            jwsObject.sign(new MACSigner(SIGN_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create token", e);
            throw new RuntimeException(e);
        }
    }

    private String buildScope(User user) {
        // Build scope with role; default to USER if role is null/empty
        List<String> scopes = new ArrayList<>();
        String role = user.getRole();
        
        // Debug logging
        log.info("Building scope for user: {} with role: {}", user.getEmail(), role);
        
        if (role == null || role.isBlank()) {
            // Default to USER role if not set
            log.warn("User {} has no role, defaulting to USER", user.getEmail());
            scopes.add("ROLE_USER");
        } else {
            scopes.add("ROLE_" + role.trim().toUpperCase());
        }
        
        String scopeString = String.join(" ", scopes);
        log.info("Generated scope: {}", scopeString);
        return scopeString;
    }

    
}
