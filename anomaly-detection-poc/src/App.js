import "./App.css";
import fridge from "./assets/smart-fridge.png";
import { useState } from "react";
import axios from "axios";
function App() {
  var cleanData ={
    "service":20,
    "flag":9,
    "src_bytes":491,
    "dst_bytes":0,
    "logged_in":0,
    "same_srv_rate":1.00,
    "diff_srv_rate":0.00,
    "dst_host_srv_count":25,
    "dst_host_same_srv_rate":0.17,
    "dst_host_diff_srv_rate":0.03
  }
    const config = {
      headers: {
        'Content-Type': 'application/json', 
      }
    };
    const randomNumberInRange = (min, max) => {
      return Math.floor(Math.random()
          * (max - min + 1)) + min;
  };
    const anomalies=()=>{
      var anomalyData = {
        "service":randomNumberInRange(0,20),
        "flag":randomNumberInRange(5,15),
        "src_bytes":randomNumberInRange(0,200),
        "dst_bytes":randomNumberInRange(0,200),
        "logged_in":randomNumberInRange(0,1),
        "same_srv_rate":randomNumberInRange(0.00,1.00),
        "diff_srv_rate":randomNumberInRange(0.00,1.00),
        "dst_host_srv_count":randomNumberInRange(20,150),
        "dst_host_same_srv_rate":0.30,
        "dst_host_diff_srv_rate":0.03
      };
      return anomalyData;
    }
  const anomalyDetectionApi = "http://127.0.0.1:5000/check-anomaly";
  const [AnomalyResult, SetAnomalyResult] = useState("");
  const sendRequest = (data) => {
    console.log(data);
    axios
      .post(anomalyDetectionApi, data, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
      .then(function (response) {
        console.log(response.data['message']);
        if(response.data['message']==0){
          SetAnomalyResult("Anomaly not detected");
        }
        else{
          SetAnomalyResult("Anomaly detected");
        }        
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const startSmartFridge = () => {
    sendRequest(JSON.stringify(cleanData));
    // showResult();
  };
  const sendAnomalyData = () => {
    sendRequest(JSON.stringify(anomalies()));
    //showResult(sendRequest(prepareRequest(anomalyData)));
  };
  return (
    <div className="main-container">
      <img src={fridge} alt="Logo" height={400} width={400} className="image" />
      <div className="button-container">
        <button className="button1" onClick={startSmartFridge}>
          Start
        </button>
        {/* <button className="button2" onClick={sendAnomalyData}>
          Send Anomaly Data
        </button> */}
      </div>
      <span>{AnomalyResult}</span>
    </div>
  );
}

export default App;
