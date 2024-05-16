import Timeline from "./Timeline";
import PlayList from "./Playlist";
import { useEffect, useState } from "react";
import axios from "axios";
import yaml from "js-yaml";

interface PageProps {
  name: string;
}

const Page = (props: PageProps) => {
  const [config, setConfig] = useState<Config>({
    color: {
      red: 0,
      green: 0,
      blue: 0,
    },
    avatar: "",
    playlist: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await axios.get(
          `https://vtuber-1256553639.cos.ap-shanghai.myqcloud.com/singer/${props.name}.yaml`
        ); // Replace with the actual path to your config.yaml file
        if (response.status === 200) {
          const parsedConfig = yaml.load(response.data);
          setConfig(parsedConfig as Config);
        } else {
          setError("Configuration file not found");
        }
      } catch (error) {
        setError("Error loading or parsing the YAML file");
      }
    };

    loadConfig();
  }, []);

  return (
    <>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <Timeline color={config?.color} image={config?.avatar} />
          <div style={{ marginTop: "20px" }}></div>
          <PlayList color={config?.color} songs={config?.playlist} />
        </>
      )}
    </>
  );
};

export default Page;
