package com.example.backend.models.enums;

public enum BloodType {
    A_POS, A_NEG, B_POS, B_NEG, AB_POS, AB_NEG, O_POS, O_NEG;

    public static BloodType fromString(String v) {
        switch (v) {
            case "A+": return A_POS;
            case "A-": return A_NEG;
            case "B+": return B_POS;
            case "B-": return B_NEG;
            case "AB+": return AB_POS;
            case "AB-": return AB_NEG;
            case "O+": return O_POS;
            case "O-": return O_NEG;
            default: throw new IllegalArgumentException("Unknown blood type: " + v);
        }
    }
}
