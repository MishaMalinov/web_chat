import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import config from "../cofing";
import { v4 as uuidv4 } from "uuid";
import { FiSend, FiPaperclip } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import FileUploadModal from "./FileUploadModal";

const CACHE_LIMIT = 50;

const ChatWindow = ({ chat_id }) => {
  const { userData } = useAuth();
  const token = localStorage.getItem("token");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const abortRef = useRef(null);
  const firstFreshLoad = useRef(false);
  const bottomRef = useRef(true);

  /* ------------ helpers ------------ */
  const scrollToBottom = (smooth = true) =>
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });

  const linkLabel = (att) =>
    (att?.url || att?.path || "").split(/[\\/]/).pop() || "File";

  /* ------------ read cache ---------- */
  useEffect(() => {
    if (!chat_id) return setMessages([]);
    const cached = localStorage.getItem(`chat_cache_${chat_id}`);
    if (cached) setMessages(JSON.parse(cached));
    firstFreshLoad.current = false;
  }, [chat_id]);

  /* ------------ fresh fetch --------- */
  useEffect(() => {
    if (!chat_id) return;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    axios
      .get(`${config.apiUrl}/chat-content?chat_id=${chat_id}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      })
      .then(({ data }) => {
        setMessages(data);
        firstFreshLoad.current = true;
      })
      .catch((e) => !axios.isCancel(e) && console.error(e));

    return () => controller.abort();
  }, [chat_id]);

  /* ------------ cache last 50 ------- */
  useEffect(() => {
    if (!chat_id) return;
    localStorage.setItem(
      `chat_cache_${chat_id}`,
      JSON.stringify(messages.slice(-CACHE_LIMIT))
    );
  }, [messages, chat_id]);

  /* ------------ scroll behaviour ---- */
  const handleScroll = (e) => {
    const el = e.target;
    bottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < 60;
  };

  useEffect(() => {
    if (firstFreshLoad.current) {
      scrollToBottom(false);
      firstFreshLoad.current = false;
    } else if (bottomRef.current) {
      scrollToBottom(true);
    }
  }, [messages]);

  /* ------------ WebSocket ----------- */
  useEffect(() => {
    if (!chat_id) return;
    if (socketRef.current) socketRef.current.close();

    const ws = new WebSocket(config.wssUrl);
    socketRef.current = ws;

    ws.onopen = () =>
      ws.send(JSON.stringify({ action: "subscribe", chat_id }));

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data); // contains attachment.url OR text
      if (msg.chat_id !== chat_id) return; // ignore late

      setMessages((prev) => {
        let replaced = false;
        const updated = prev.map((m) => {
          if (m.temp_id && m.temp_id === msg.temp_id) {
            if (m.attachment?.path?.startsWith("blob:"))
              URL.revokeObjectURL(m.attachment.path);
            replaced = true;
            return { ...msg, pending: false };
          }
          return m;
        });
        return replaced
          ? updated
          : [...updated, { ...msg, pending: false }];
      });
    };

    return () => ws.close();
  }, [chat_id]);

  /* ------------ send text ----------- */
  const sendText = async () => {
    if (!input.trim()) return;
    const temp_id = uuidv4();

    setMessages((p) => [
      ...p,
      {
        temp_id,
        text: input,
        sender: { username: userData.username },
        pending: true,
      },
    ]);
    setInput("");

    try {
      await axios.post(
        `${config.apiUrl}/messages`,
        { chat_id, message: input, temp_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (e) {
      console.error("Send error:", e);
    }
  };

  /* ------------ send files ---------- */
  const handleFiles = async (files) => {
    if (!files?.length) return;

    files.forEach(async (file) => {
      const temp_id = uuidv4();
      const objURL = URL.createObjectURL(file); // temp link

      setMessages((p) => [
        ...p,
        {
          temp_id,
          attachment: { name: file.name, size: file.size, path: objURL },
          sender: { username: userData.username },
          pending: true,
        },
      ]);

      const fd = new FormData();
      fd.append("files[]", file);
      fd.append("chat_id", chat_id);
      fd.append("temp_id", temp_id);

      try {
        await axios.post(`${config.apiUrl}/upload-files`, fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (e) {
        console.error("Upload error:", e);
      }
    });

    setShowUpload(false);
  };

  /* ============ RENDER ============== */
  return (
    <div className="chat-window d-flex flex-column h-100">
      {/* messages */}
      <div
        className="messages flex-grow-1 overflow-auto px-2"
        onScroll={handleScroll}
      >
        {messages.map((m, i) => (
          <div
            key={m.id || m.temp_id || i}
            className={`message ${
              m.sender.username === userData.username ? "sent" : "received"
            }`}
          >
            <div className="d-flex align-items-center">
              {m.attachment?.path || m.attachment?.url ? (
                <a
                  href={m.attachment.url || m.attachment.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="me-2 text-white text-decoration-underline"
                >
                  {linkLabel(m.attachment)}
                </a>
              ) : null}

              {m.text && (
                <span style={{ whiteSpace: "pre-wrap" }}>{m.text}</span>
              )}

              {m.pending && (
                <span className="ms-2 pending-dot" title="Sending…" />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* input */}
      <div className="input-box d-flex p-2 border-top">
        <textarea
          className="form-control flex-grow-1"
          placeholder="Type a message…"
          value={input}
          rows={1}
          maxLength={2000}
          onChange={(e) => setInput(e.target.value)}
        />
        <AnimatePresence initial={false} mode="wait">
          {!input ? (
            <motion.button
              key="attach"
              className="btn btn-primary ms-2"
              onClick={() => setShowUpload(true)}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              title="Attach file"
            >
              <FiPaperclip size={22} />
            </motion.button>
          ) : (
            <motion.button
              key="send"
              className="btn btn-primary ms-2"
              onClick={sendText}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              title="Send"
            >
              <FiSend size={22} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* modal */}
      <FileUploadModal
        show={showUpload}
        onClose={() => setShowUpload(false)}
        onFiles={handleFiles}
      />
    </div>
  );
};

export default ChatWindow;
