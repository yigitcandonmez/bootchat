import { useContext, useEffect } from 'react';
import { userContext } from "../context/userContext"
import styles from './Channels.module.css';

const Channels = () => {
  const { channels, setChannels, setChannel, channel } = useContext(userContext)

  useEffect(() => {
    const getChannels = async () => {
      const response = await fetch("http://localhost:8080/getChannels")
      const json = await response.json();
      setChannels(json);
    };
    getChannels();
  }, [])

  return (
    <div className={styles.channelsContainer}>
      {
        channels?.map((e) => {
          return <div
            className={styles.channelName}
            onClick={() => {
              if (channel.currentChannel === e.channel) { return; } else {
                setChannel((prevChannel) => {
                  return {
                    prevChannel: prevChannel.currentChannel,
                    currentChannel: e.channel
                  }
                })
              }
            }}
          >
            <p className={styles.hash}>#</p>{' '}
            <h2 className={styles.channelTitle}>{e.channel}</h2>
          </div>
        })
      }
    </div>
  );
};

export default Channels;
