import React, { useState, useEffect, useContext } from 'react';
import useAuth from '../../../shared/hooks/useAuth';
import { useHttpClient } from '../../../shared/hooks/http-hook';
import { API_ENDPOINTS } from '../../../shared/util/apiConfig';
import { VALIDATOR_REQUIRE } from '../../../shared/util/validators';
import Input from '../../../shared/components/FormElements/Input';
import Button from '../../../shared/components/FormElements/Button';
import ErrorModal from '../../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../../shared/components/UIElements/LoadingSpinner';
import { SettingsContext } from '../../../shared/context/SettingContext';
import ImageUpload from '../../../shared/components/FormElements/ImageUpload';
import { useForm } from '../../../shared/hooks/form-hook';
import Modal from '../../../shared/components/UIElements/Modal';

import '../admin/SiteSetting.css';

const SiteSettings = () => {
  const auth = useAuth();
  const apiEndpoints = API_ENDPOINTS();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { settings, setSettings } = useContext(SettingsContext);
  const [sliderImages, setSliderImages] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [showForm, setShowForm] = useState(true);

  const [formState, inputHandler, setFormData] = useForm(
    {
      siteTitle: { value: '', isValid: false },
      logoUrl: { value: '', isValid: false },
      banners: { value: '', isValid: false },
      navbar: { value: '', isValid: false },
      footer: { value: '', isValid: false },
      image: { value: null, isValid: false }
    },
    false
  );

  useEffect(() => {
    if (settings) {
      setFormData(
        {
          siteTitle: { value: settings.siteTitle, isValid: true },
          logoUrl: { value: settings.logoUrl, isValid: true },
          banners: { value: settings.banners, isValid: true },
          navbar: { value: settings.navbar, isValid: true },
          footer: { value: settings.footer, isValid: true },
          image: { value: null, isValid: true }
        },
        true
      );
      setSliderImages(settings.sliderImages || []);
    }
  }, [settings, setFormData]);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('siteTitle', formState.inputs.siteTitle.value);
      formData.append('logoUrl', formState.inputs.logoUrl.value);
      formData.append('banners', formState.inputs.banners.value);
      formData.append('navbar', formState.inputs.navbar.value);
      formData.append('footer', formState.inputs.footer.value);
      if (formState.inputs.image.value) {
        formData.append('image', formState.inputs.image.value);
      }

      const responseData = await sendRequest(apiEndpoints.UPDATE_SETTINGS, 'PUT', formData, {});

      setSettings(responseData.settings);
      setSuccessMessage('Settings updated successfully!');
      setShowForm(false);

      setFormData(
        {
          siteTitle: { value: '', isValid: false },
          logoUrl: { value: '', isValid: false },
          banners: { value: '', isValid: false },
          navbar: { value: '', isValid: false },
          footer: { value: '', isValid: false },
          image: { value: null, isValid: false }
        },
        false
      );
    } catch (error) {
      // Error handling is done by the useHttpClient hook
    }
  };

  const clearSuccessMessage = () => {
    setSuccessMessage('');
  };

  return (
    <div className="site-settings-container">
      <h2>Site Settings</h2>
      {showForm ? (
        <form className="site-settings-form" onSubmit={onSubmit}>
          <Input
            id="siteTitle"
            element="input"
            type="text"
            label="Site Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid site title."
            onInput={inputHandler}
            initialValue={formState.inputs.siteTitle.value}
            initialValid={formState.inputs.siteTitle.isValid}
          />
          <Input
            id="logoUrl"
            element="input"
            type="text"
            label="Logo URL"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid logo URL."
            onInput={inputHandler}
            initialValue={formState.inputs.logoUrl.value}
            initialValid={formState.inputs.logoUrl.isValid}
          />
          <Input
            id="banners"
            element="textarea"
            label="Banners"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter banners."
            onInput={inputHandler}
            initialValue={formState.inputs.banners.value}
            initialValid={formState.inputs.banners.isValid}
          />
          <Input
            id="navbar"
            element="textarea"
            label="Navbar"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter navbar details."
            onInput={inputHandler}
            initialValue={formState.inputs.navbar.value}
            initialValid={formState.inputs.navbar.isValid}
          />
          <Input
            id="footer"
            element="textarea"
            label="Footer"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter footer details."
            onInput={inputHandler}
            initialValue={formState.inputs.footer.value}
            initialValid={formState.inputs.footer.isValid}
          />
          <ImageUpload
            center
            id="image"
            onInput={inputHandler}
            errorText="Please provide an image."
          />
          <Button type="submit" disabled={!formState.isValid || isLoading}>
            Update Settings
          </Button>
        </form>
      ) : (
        <div className="updated-settings">
          <h3>Updated Settings</h3>
          <p><strong>Site Title:</strong> {settings.siteTitle}</p>
          <p><strong>Logo URL:</strong> {settings.logoUrl}</p>
          <p><strong>Banners:</strong> {settings.banners}</p>
          <p><strong>Navbar:</strong> {settings.navbar}</p>
          <p><strong>Footer:</strong> {settings.footer}</p>
          <Button onClick={() => setShowForm(true)}>Edit Settings</Button>
        </div>
      )}

      <div className="slider-images">
        <h2>Slider Images</h2>
        {sliderImages.map((image, index) => (
          <div key={index}>
            <img src={`${apiEndpoints.BASE_URL}/${image}`} alt={`Slider ${index}`} className="slider-image" />
          </div>
        ))}
      </div>

      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />

      <Modal
        show={!!successMessage}
        onCancel={clearSuccessMessage}
        header="Success!"
        footer={<Button onClick={clearSuccessMessage}>OK</Button>}
      >
        <p>{successMessage}</p>
      </Modal>
    </div>
  );
};

export default SiteSettings;
