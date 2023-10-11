import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const today = new Date();
const formattedDate = `${today.getMonth() + 1}월`;
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: formattedDate + " 수입 / 지출",
    },
  },
};
const PieDashboard = () => {
  const [data, setData] = useState({
    labels: ["수입", "지출"],
    datasets: [
      {
        label: "Dataset 1",
        data: [],
      },
    ],
  });
  useEffect(() => {
    const token = window.localStorage.getItem("token");
    axios
      .post("/dashboard/pie", null, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setData({
          labels: ["수입", "지출"],
          datasets: [
            {
              label: "합계",
              data: res.data,
              backgroundColor: [
                "rgba(255, 99, 132, 0.5)",
                "rgba(54, 162, 235, 0.5)",
              ],
              borderColor: [
                "rgba(255, 99, 132,1.5)",
                "rgba(54, 162, 235, 1.5)",
              ],
            },
          ],
        });
      })
      .catch((res) => {
        console.log(res.response.status);
      });
  }, []);
  return (
    <div>
      <div>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};
export default PieDashboard;
