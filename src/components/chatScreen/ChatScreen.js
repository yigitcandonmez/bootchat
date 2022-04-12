import { useContext, useState, useRef, useEffect } from 'react';
import styles from './ChatScreen.module.css';
import { userContext } from '../context/userContext';
import BackgroundVideo from '../backgroundVideo/BackgroundVideo';
import { io } from 'socket.io-client';

const socket = io("http://localhost:8080");

const ChatScreen = () => {
  const { user, isLoggedIn, collectionName } =
    useContext(userContext);
  const inputRef = useRef('');

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [channel, setChannel] = useState("game");

  console.log(messages)

  const dummy = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      channel: channel,
      message: `${inputRef.current.value}`,
      photo: `${user.photo}`,
      name: `${user.name}`,
      email: `${user.email}`,
      time: Math.floor(new Date().getTime() / 1000),
    }

    socket.emit("CHAT_MESSAGE", data);

    setMessage('');
  };

  useEffect(() => {
    socket.emit("JOIN_CHANNEL", channel);
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    socket.on("message", (data) => {
      console.log(data)
      setMessages((messages) => [...messages, data]);
    })
  }, [])

  useEffect(() => {
    if (dummy.current) {
      dummy?.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const goUp = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isLoggedIn ? (
        <div className={styles.chatScreenContainer}>
          <div className={styles.messagesContainer}>
            <h1 className={styles.collectionName}>
              #{' '}
              {collectionName.charAt(0).toUpperCase() + collectionName.slice(1)}
            </h1>
            <svg
              onClick={goUp}
              className={styles.upArrow}
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='#4f6aeb'
              stroke-width='2'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                d='M5 10l7-7m0 0l7 7m-7-7v18'
              />
            </svg>
            {messages.length > 0 &&
              messages
                .sort(function (x, y) {
                  return x.time - y.time;
                })
                .map((message, index) => {
                  const date = new Date(message.time * 1000);
                  const day = '0' + date.getDate();
                  const month = '0' + (date.getMonth() + 1);
                  const hours = '0' + date.getHours();
                  const minutes = '0' + date.getMinutes();
                  return (
                    <div
                      key={index}
                      className={
                        message.email === user.email
                          ? styles.myMessage
                          : styles.message
                      }
                    >
                      <img
                        className={styles.photo}
                        src={message.photo}
                        alt='user profile'
                      />
                      <p className={styles.text}>{message.message}</p>
                      <p className={styles.userName}>{message.name}</p>
                      <p className={styles.dateAndTime}>{`${day.slice(
                        -2
                      )}/${month.slice(-2)}/${date.getFullYear()}`}</p>
                      <p className={styles.dateAndTime}>{`${hours.slice(
                        -2
                      )}:${minutes.slice(-2)}`}</p>
                    </div>
                  );
                })}
            <div ref={dummy} className={styles.dummyDiv}></div>
          </div>

          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.chatForm}>
              <input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={styles.input}
                type='text'
                required
              />
              <button type='submit' className={styles.sendButton}>
                <svg
                  className={styles.sendIcon}
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      ) : (
        <BackgroundVideo />
      )}
    </>
  );
};

export default ChatScreen;
