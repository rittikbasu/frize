import { useState, useEffect, useRef } from "react";
import { Button, Text, TextInput } from "@tremor/react";
import { BiSearch } from "react-icons/bi";
import Drawer from "react-modern-drawer";

export default function SearchDrawer(props) {
  const [isDark, setIsDark] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messageBoxRef = useRef(null);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, [props.isOpen]);

  const [scrollToBottomNeeded, setScrollToBottomNeeded] = useState(false);

  const scrollToBottom = () => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (scrollToBottomNeeded) {
      scrollToBottom();
      setScrollToBottomNeeded(false); // Reset the state after scrolling
    }
  }, [scrollToBottomNeeded]);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: query, isUser: true },
    ]);
    setQuery("");
    setScrollToBottomNeeded(true);
    let aiResponse = "";
    try {
      const response = await fetch("/api/semanticSearch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        aiResponse = JSON.parse(data).choices[0].message.content;
      } else {
        console.error("Error fetching search results");
        aiResponse = "Sorry, I'm having trouble fetching the results";
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      aiResponse = "Sorry, I'm having trouble fetching the results";
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: aiResponse, isUser: false },
    ]);
    setScrollToBottomNeeded(true);
    setLoading(false);
  };

  //   handleSearch();
  return (
    <Drawer
      open={props.isOpen}
      onClose={props.closeDrawer}
      direction="bottom"
      className="rounded-t-2xl w-full max-w-5xl mx-auto bg-black border-t-4 dark:border-t dark:border-blue-500 border-blue-600"
      overlayOpacity={0.7}
      size="80vh"
      lockBackgroundScroll={true}
      style={{
        backgroundColor: isDark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.8)",
        overflow: "hidden",
      }}
      customIdSuffix="search-drawer"
    >
      <div className="my-4 h-full flex flex-col overflow-x-hidden">
        <div className="flex items-center px-4">
          <Text className="text-2xl">AI Powered Search</Text>
          <Button
            size="sm"
            color="red"
            variant="light"
            className="ml-auto font-normal"
            onClick={props.closeDrawer}
          >
            Close
          </Button>
        </div>

        {/* Message Box */}
        <div
          ref={messageBoxRef}
          className="flex-grow px-4 mx-2 py-3 mt-6 overflow-y-auto border border-gray-400/50 dark:border-gray-700 rounded-2xl"
        >
          <div className="flex flex-col gap-y-5">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col gap-y-1 ${
                  message.isUser ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`px-4 py-1.5 rounded-2xl text-sm ${
                    message.isUser
                      ? "bg-blue-500 text-white dark:bg-blue-600"
                      : "bg-zinc-600 text-white dark:bg-gray-600"
                  }`}
                >
                  {message.isUser ? (
                    message.text
                  ) : (
                    <pre
                      className="whitespace-pre-wrap font-sans"
                      dangerouslySetInnerHTML={{ __html: message.text }}
                    ></pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div
          className={`${
            loading ? "bg-gray-200 dark:bg-gray-800" : "bg-white dark:bg-black"
          } mx-2 mb-6 mt-2 dark:border dark:border-r-0 border-gray-400/50 dark:border-gray-700 rounded-full`}
        >
          <div className="flex items-center gap-x-2">
            <input
              placeholder="Search"
              className={`${
                loading
                  ? "bg-gray-200 dark:bg-gray-800"
                  : "bg-white dark:bg-black"
              } w-full text-sm text-gray-900 dark:text-white pl-4 outline-none rounded-full`}
              value={query}
              maxLength={150}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              disabled={loading}
            />
            <button
              className={`p-[0.65rem] text-white rounded-full ${
                loading && "animate-spin opacity-60 cursor-wait"
              } bg-blue-500 dark:bg-blue-700`}
              disabled={loading}
              onClick={handleSearch}
            >
              <BiSearch />
            </button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
