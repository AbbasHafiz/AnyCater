import React, { useContext } from 'react';
import { SettingsContext } from '../../../shared/context/SettingContext';
import './Slider.css';
import { API_ENDPOINTS } from '../../../shared/util/apiConfig';

const Slider = () => {
  const { settings } = useContext(SettingsContext);
  const apiEndpoints = API_ENDPOINTS();

  return (
    <div className="slider">
      {settings && settings.sliderImages && settings.sliderImages.map((image, index) => (
        <div key={index} className="slider__image">
          <img src={`${apiEndpoints.BASE_URL}/${image}`} alt={`Slider ${index}`} />
        </div>
      ))}
    </div>
  );
};

export default Slider;
