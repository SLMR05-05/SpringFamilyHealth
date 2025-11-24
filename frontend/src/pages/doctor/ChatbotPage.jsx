import { Button, Card, Input, Space, Typography, Tooltip } from "antd";
import {
  SendOutlined,
  HistoryOutlined,
  RobotOutlined,
  StarOutlined,
  EllipsisOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import React, { useState, useRef, useEffect } from "react";

const { Title, Text } = Typography;
const { TextArea } = Input;

const initialPrompts = [
  {
    title: "Liều lượng Paracetamol cho trẻ 5 tuổi?",
    description: "Tra cứu thông tin thuốc",
    query: "Liều lượng Paracetamol cho trẻ 5 tuổi là bao nhiêu?",
  },
  {
    title: "Các triệu chứng của bệnh sốt xuất huyết?",
    description: "Hỗ trợ chẩn đoán sơ bộ",
    query: "Triệu chứng điển hình của bệnh sốt xuất huyết là gì?",
  },
  {
    title: "Tóm tắt hồ sơ bệnh nhân Nguyễn Văn A",
    description: "Tóm tắt hồ sơ y tế",
    query: "Tóm tắt các thông tin chính trong hồ sơ bệnh nhân Nguyễn Văn A.",
  },
  {
    title: "Nghiên cứu mới nhất về điều trị tiểu đường type 2",
    description: "Tìm kiếm tài liệu tham khảo",
    query:
      "Các nghiên cứu và phác đồ điều trị mới nhất cho bệnh tiểu đường type 2 là gì?",
  },
];

const AIChatAssistantPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (!inputQuery.trim()) return;
    const newUserMessage = { type: "user", content: inputQuery.trim() };
    const newAIMessage = {
      type: "ai",
      content: `Đang xử lý: "${inputQuery.trim()}"... (Đây là câu trả lời giả lập).`,
    };
    setMessages([...messages, newUserMessage, newAIMessage]);
    setInputQuery("");
  };

  const handlePromptClick = (query) => setInputQuery(query);

  const renderInitialContent = () => (
    <div className="flex flex-col items-center justify-center h-full p-8 max-w-4xl mx-auto">
      <div className="p-5 bg-blue-100 rounded-full mb-6 inline-block">
        <RobotOutlined className="text-blue-600 text-5xl" />
      </div>
      <Title
        level={2}
        className="text-gray-800 font-extrabold mb-2 text-center"
      >
        Trợ lý AI Y Tế
      </Title>
      <Text className="text-gray-500 mb-8 text-center text-lg">
        Tra cứu, hỗ trợ chẩn đoán và tìm tài liệu tham khảo nhanh chóng.
      </Text>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {initialPrompts.map((prompt, idx) => (
          <Card
            key={idx}
            hoverable
            onClick={() => handlePromptClick(prompt.query)}
            className="flex items-center gap-3 p-4 border-gray-200 rounded-xl transition hover:shadow-lg hover:border-blue-400 cursor-pointer"
          >
            <StarOutlined className="text-yellow-400 text-2xl" />
            <div>
              <Title level={5} className="m-0">
                {prompt.title}
              </Title>
              <Text type="secondary">{prompt.description}</Text>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderMessage = (msg, idx) => {
    const isUser = msg.type === "user";
    const Avatar = isUser ? (
      <img
        src="path/to/minhanh_avatar.png"
        alt="User Avatar"
        className="w-9 h-9 rounded-full shadow-sm object-cover"
      />
    ) : (
      <RobotOutlined className="text-white bg-blue-500 p-2 rounded-full text-xl shadow-md" />
    );

    return (
      <div
        key={idx}
        className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`flex items-end max-w-3xl ${
            isUser ? "flex-row-reverse space-x-reverse" : "space-x-3"
          }`}
        >
          <div className="mt-auto">{Avatar}</div>
          <div
            className={`p-4 rounded-2xl shadow-md text-base wrap-break-word  transition-all ${
              isUser
                ? "bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
                : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
            }`}
          >
            {msg.content}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex justify-between items-center p-4 border-b bg-white shadow sticky top-0 z-20">
        <div>
          <Title level={4} className="m-0 text-gray-800">
            Trợ lý AI Y Tế
          </Title>
          <Text className="text-sm text-gray-500">
            Tra cứu thông tin & hỗ trợ chẩn đoán nhanh
          </Text>
        </div>
        <Space size="middle">
          <Tooltip title="Lịch sử chat">
            <Button
              icon={<HistoryOutlined />}
              shape="circle"
              size="large"
              className="hover:bg-blue-50 transition"
            />
          </Tooltip>
          <Tooltip title="Tùy chọn">
            <Button
              icon={<EllipsisOutlined />}
              shape="circle"
              size="large"
              className="hover:bg-blue-50 transition"
            />
          </Tooltip>
        </Space>
      </div>

      <div
        className="grow overflow-y-auto p-6 flex flex-col items-center"
        style={{ height: "calc(100vh - 128px)" }}
      >
        {messages.length === 0 ? (
          renderInitialContent()
        ) : (
          <div className="max-w-4xl w-full mx-auto flex flex-col gap-4">
            {messages.map(renderMessage)}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="p-8 bg-white border-t sticky bottom-0 z-10 shadow-lg">
        {/* Vùng Input & Nút Gửi (Tái tạo hình dạng và viền) */}
        <div className="flex items-center">
          {/* Khu vực nhập liệu (TextArea) */}  
          <TextArea
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Nhập câu hỏi của bạn ở đây..."
            autoSize={{ minRows: 1, maxRows: 5 }}
            className="grow border-none focus:shadow-none resize-none px-4 py-3 bg-transparent text-bas "
            style={{ WebkitBoxShadow: "none", boxShadow: "none" }} // Loại bỏ shadow mặc định của AntD/browser
          />

          {/* Icons (Attachment và Send) */}
          <Space size="middle" className="px-2">
            

            {/* Nút Gửi (Màu xanh đậm, nằm chìm) */}
            <Button
              type="primary"
              icon={<SendOutlined className="text-lg" />}
              onClick={handleSend}
              disabled={inputQuery.trim() === ""}
              className="bg-blue-700 hover:bg-blue-800 border-none w-10 h-10 flex items-center justify-center rounded-lg shadow-md"
              style={{ padding: 0 }}
            />
          </Space>
        </div>
      </div>
    </div>
  );
};

export default AIChatAssistantPage;
