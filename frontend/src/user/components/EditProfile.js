import React, { useContext, useEffect, useState } from 'react';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_PHONE,
} from '../../shared/util/validators';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { API_ENDPOINTS } from '../../shared/util/apiConfig';

const EditProfile = ({ onUpdateSuccess, userProfileData, onUpdateImage }) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [successMessage, setSuccessMessage] = useState(null);
  const apiEndpoints = API_ENDPOINTS();

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: '',
        isValid: false,
      },
      email: {
        value: '',
        isValid: false,
      },
      phoneNo: {
        value: '',
        isValid: false,
      },
      image: {
        value: null,
        isValid: true, // Initially set to true
      },
    },
    false
  );

  useEffect(() => {
    if (userProfileData) {
      setFormData({
        name: {
          value: userProfileData.name,
          isValid: true,
        },
        email: {
          value: userProfileData.email,
          isValid: true,
        },
        phoneNo: {
          value: userProfileData.phoneNo,
          isValid: true,
        },
        image: {
          value: userProfileData.image,
          isValid: true, // Set to true if an initial image is provided
        },
      }, true);
    }
  }, [userProfileData, setFormData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append('name', formState.inputs.name.value);
      formData.append('email', formState.inputs.email.value);
      formData.append('phoneNo', formState.inputs.phoneNo.value);
      if (formState.inputs.image.value) {
        formData.append('image', formState.inputs.image.value);
      }
  
      const responseData = await sendRequest(
        apiEndpoints.EDIT_PROFILE,
        'PATCH',
        formData,
        {
          Authorization: 'Bearer ' + auth.token,
        }
      );
  
      console.log('Server Response:', responseData);
  
      if (responseData) {
        setSuccessMessage('Profile updated successfully!');
        onUpdateSuccess(responseData);
        if (responseData.image) {
          onUpdateImage(responseData.image);
          console.log(responseData.image);
        }
      } else {
        console.error('Error updating user profile:', responseData);
  
        if (responseData && responseData.message) {
          if (responseData.message.includes('Email already exists')) {
            Error('email', 'Email already exists for another user');
          } else if (responseData.message.includes('Phone number already exists')) {
            Error('phoneNo', 'Phone number already exists for another user');
          }
        }
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      console.log('Response:', error.responseData);
    }
  };
  
  return (
    <>
      <ErrorModal error={error} onClear={() => { clearError(); setSuccessMessage(); }} />
      {successMessage && <p>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <Input
          id="name"
          element="input"
          type="text"
          label="Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid name."
          onInput={inputHandler}
          initialValue={userProfileData.name}
          initialValid={formState.inputs.name.isValid}
        />
        <Input
          id="email"
          element="input"
          type="email"
          label="Email"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid email."
          onInput={inputHandler}
          initialValue={userProfileData.email}
          initialValid={formState.inputs.email.isValid}
        />
        <Input
          id="phoneNo"
          element="input"
          type="tel"
          label="Phone Number"
          validators={[VALIDATOR_PHONE()]}
          errorText="Please enter a valid phone number."
          onInput={inputHandler}
          initialValue={userProfileData.phoneNo}
          initialValid={formState.inputs.phoneNo.isValid}
        />
        <ImageUpload
          center
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image."
        />
        <Button type="submit" disabled={!formState.isValid}>
          Update Profile
        </Button>
      </form>
    </>
  );
};

export default EditProfile;
