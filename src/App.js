import "./App.css";

function App() {
  const API_KEY = process.env.REACT_APP_API_KEY;
  const date = "base_date=20220822";
  //김해시 한림면 위치
  const nx = "nx=93";
  const ny = "ny=79";
  const fetchWeatherJSON = async () => {
    const response = await fetch(
      `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${API_KEY}&numOfRows=10&pageNo=1&${date}&base_time=2000&${nx}&${ny}&dataType=JSON`
    );
    const weather = await response.json();
    return weather;
  };
  fetchWeatherJSON().then((weather) => {
    const popRate = weather.response.body.items.item.filter((ctg) => {
      return ctg.category === "POP";
    });
    console.log(weather);
    console.log(popRate[0].fcstValue);
  });

  return <h1>Hi</h1>;
}
export default App;
