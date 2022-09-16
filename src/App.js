import "./App.css";
import React, { useState, useEffect } from "react";

const API_KEY = process.env.REACT_APP_API_KEY;

function App() {
  const [dateData, setDateData] = useState(new Date());
  const [weatherData, setWeatherData] = useState([]);
  const [baseTime, setBaseTime] = useState(" ");
  const year = dateData.getFullYear();

  let month = dateData.getMonth() + 1;
  if (month !== "12") {
    month = `0${month}`;
  }

  let date = dateData.getDate();
  if (date < 10) {
    date = `0${date}`;
  }

  let hours = dateData.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = dateData.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  const time = `${hours}${minutes}`;

  let seconds = dateData.getSeconds();
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  const today = `base_date=${year}${month}${date}`;

  // 단기예보 base_time 시간표
  // 0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300 (1일8회)
  // API는 모든 시간대 10분이후부터 제공.
  useEffect(() => {
    if ((210 < time) & (time <= 510)) {
      setBaseTime("0200");
    } else if (510 < time && time <= 810) {
      setBaseTime("0500");
    } else if (810 < time && time <= 1110) {
      setBaseTime("0800");
    } else if (1110 < time && time <= 1410) {
      setBaseTime("1100");
    } else if (1410 < time && time <= 1710) {
      setBaseTime("1400");
    } else if (1710 < time && time <= 2010) {
      setBaseTime("1700");
    } else if (2010 < time && time <= 2310) {
      setBaseTime("2000");
    } else {
      setBaseTime("2300");
    }
  }, [time]);

  //  김해시 한림면 x,y 좌표
  const nx = "nx=93";
  const ny = "ny=79";

  useEffect(() => {
    const fetchWeatherJSON = async () => {
      try {
        const response = await fetch(
          `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${API_KEY}&numOfRows=200&pageNo=1&${today}&base_time=${baseTime}&${nx}&${ny}&dataType=JSON`
        );
        const weather = await response.json();

        return weather;
      } catch (e) {
        // 에러메세지
        console.log(e);
      }
    };
    fetchWeatherJSON().then((weather) => {
      const weatherInfo = weather.response.body.items.item;
      setWeatherData(weatherInfo);
    });
  }, [today, baseTime]);

  useEffect(() => {
    const dateObjInterval = setInterval(() => setDateData(new Date()), 1000);
    return () => clearInterval(dateObjInterval);
  }, []);

  /**강수확률 */
  const pop = weatherData.filter((item) => {
    return item.category === "POP";
  });
  /**습도 */
  const reh = weatherData.filter((item) => {
    return item.category === "REH";
  });
  /**강수형태 */
  const pty = weatherData.filter((item) => {
    return item.category === "PTY";
  });
  /**하늘상태 */
  const sky = weatherData.filter((item) => {
    return item.category === "SKY";
  });
  /**일최저 기온**/
  const tmn = weatherData.filter((item) => {
    return item.category === "TMN";
  });
  /**일최고 기온**/
  const tmx = weatherData.filter((item) => {
    return item.category === "TMX";
  });

  return (
    <div>
      {pop.map((item) => (
        <li>{item.fcstValue}</li>
      ))}
      {baseTime}
      {time}
      {seconds}
    </div>
  );
}
export default App;
