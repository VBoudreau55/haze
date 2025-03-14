import React, { useEffect } from "react";
import * as echarts from "echarts";
import "echarts-gl";

const HeroSection = () => {
  useEffect(() => {
    const chartDom = document.getElementById("globe");
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      const option = {
        backgroundColor: "#000",
        globe: {
          baseTexture: "https://echarts.apache.org/examples/data-gl/asset/earth.jpg",
          shading: "lambert",
          environment: "https://echarts.apache.org/examples/data-gl/asset/starfield.jpg",
          atmosphere: { show: true },
          light: {
            ambient: { intensity: 0.1 },
            main: { intensity: 1.5 },
          },
        },
        series: [],
      };
      myChart.setOption(option);
    }
  }, []);

  return (
    <div id="globe" style={{ width: "100%", height: "100vh" }} />
  );
};

export default HeroSection;
