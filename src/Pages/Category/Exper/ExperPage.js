import { useEffect, useState } from 'react';
import axios from 'axios';

const ExperPage = () => {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    axios.get('/api') // 체험 예약 API 엔드포인트
      .then(response => setExperiences(response.data))
      .catch(error => console.error("체험 예약 데이터를 가져오는 중 오류:", error));
  }, []);

  return (
    <div>
      <h1>체험 예약 목록</h1>
      <ul>
        {experiences.map(experience => (
          <li key={experience.id}>{experience.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ExperPage;
