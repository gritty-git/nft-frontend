import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";

function App() {
  const [NFTNames, setNFTNames] = useState([]);
  const [NFTTime, setNFTTime] = useState([]);
  const [NFTPrice, setNFTPrice] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [NFTStartDate, setNFTStartDate] = useState(null);
  const [NFTEndDate, setNFTEndDate] = useState(null);
  const [NFT, setNFT] = useState("");
  const API_URL = "https://nft-backend-37yx.onrender.com";
  async function NFTNamesSetter() {
    const res = await axios.get(API_URL + "/api");
    console.log(res);
    setNFTNames(() => {
      return res.data;
    });
  }
  async function fetchNFTData() {
    const res = await axios.get(API_URL + "/api/nft_data", {
      params: { NFTName: NFT, startDate: startDate, endDate: endDate },
    });

    setNFTPrice(() => {
      return res.data.NFT_PRICE;
    });
    setNFTTime(() => {
      return res.data.NFT_TIME;
    });
  }
  async function fetchNFTDate() {
    const res = await axios.get(API_URL + "/api/nft_date", {
      params: { NFTName: NFT },
    });
    setNFTStartDate(() => {
      return res.data.startTime;
    });
    setNFTEndDate(() => {
      return res.data.endTime;
    });
    //console.log(res.data);
  }
  useEffect(() => {
    if (NFTNames.length === 0) {
      NFTNamesSetter();
    }
    if (NFT.length !== 0 && startDate && endDate) {
      fetchNFTData();
    } else {
      fetchNFTDate();
    }
  }, [NFT, startDate, endDate]);

  function dropdownOptions() {
    return NFTNames.map((nft) => {
      return <option value={nft}>{nft}</option>;
    });
  }
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `${NFT}'s price chart`,
      },
    },
  };
  const data = {
    labels: NFTTime,
    datasets: [
      {
        label: "Price",
        data: NFTPrice,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };
  //console.log(startDate, endDate);
  return (
    <div className="App">
      {NFTNames.length === 0 ? (
        <select>
          <option value="choose" disabled selected="selected">
            Loading...
          </option>
        </select>
      ) : (
        <div style={{ width: "100%" }}>
          <br />
          <select onChange={(e) => setNFT(e.target.value)}>
            <option value="choose" disabled selected="selected">
              -- Select NFT --
            </option>
            {dropdownOptions()}
          </select>
          <br />

          <br />
          {NFT.length ? (
            <>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStartDate(() => {
                    return parseInt(
                      (new Date(e.target[0].value).getTime() / 1000).toFixed(0)
                    );
                  });
                  setEndDate(() => {
                    return parseInt(
                      (new Date(e.target[1].value).getTime() / 1000).toFixed(0)
                    );
                  });
                  //console.log(e);
                }}
              >
                <label for="start">Start date:</label>{" "}
                <input id={"start"} type={"date"} />{" "}
                <label for="end">End date:</label>{" "}
                <input id={"end"} type={"date"} />{" "}
                <button type="submit">Go</button>
              </form>
              <br />
              There is price data available for the given NFT from{" "}
              {NFTStartDate} till {NFTEndDate}.
            </>
          ) : (
            <></>
          )}
          {NFT.length && NFTPrice.length && NFTTime.length ? (
            <Line options={options} data={data} />
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
