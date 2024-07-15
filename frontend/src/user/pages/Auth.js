import React, { useState ,useEffect} from 'react';
import { useNavigate} from 'react-router-dom';
import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
  VALIDATOR_PHONE
} from '../../shared/util/validators';
import { API_ENDPOINTS }  from '../../shared/util/apiConfig';
import useAuth from '../../shared/hooks/useAuth';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './Auth.css';
const Auth = (props) => {
  const apiEndpoints = API_ENDPOINTS();
  const auth = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const navigate = useNavigate();
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
          phoneNo: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false
          },
          image: {
            value: null,
            isValid: false
          },
          username: {
            value: '',
            isValid: true,
          },
          phoneNo: {
            value: '',
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode(prevMode => !prevMode);
  };
  
  useEffect(() => {

  }, [formState]);
  

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (isLoginMode) {
        const responseData = await sendRequest(
          apiEndpoints.LOGIN,
          'POST', 
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {
            'Content-Type': 'application/json'
          }
        );

        auth.login(responseData);
        if (responseData.role) {
          handleRoleNavigation(responseData.role);
        } else {
          console.error('User role not found in userDetails:', responseData);
        }
      } else {
        const formData = new FormData();
        formData.append('email', formState.inputs.email.value);
        formData.append('name', formState.inputs.name.value);
        formData.append('username', formState.inputs.username.value);
        formData.append('phoneNo', formState.inputs.phoneNo.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('image', formState.inputs.image.value);
       
        
        const responseData = await sendRequest(
          apiEndpoints.REGISTER,
          'POST',
          formData
        );
        auth.login(responseData);

        handleRoleNavigation('User'); // Redirect to the user dashboard after signup
      }
    } catch (error) {
      // Error handling is done by the useHttpClient hook
    }
  };
  const handleRoleNavigation = (role) => {
    switch (role) {
      case "Admin":
        navigate("/admin-dashboard");
        break;
      case "User":
        navigate("/user-dashboard");
        break;
      case "Owner":
        navigate("/owner-dashboard");
        break;
      default:
        // Handle unknown role
        console.error("Unknown role:", role);
        // Redirect to a default dashboard or handle it accordingly
        navigate("/user-dashboard");
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
              errorText="Please provide an image."
            />
          )}
          {!isLoginMode && (
            <Input
              element="input"
              id="username"
              type="text"
              label="User Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <Input
              element="input"
              id="phoneNo"
              type="text"
              label="Phone"
              validators={[VALIDATOR_PHONE()]}
              errorText="Please enter a Valid PhoneNo."
              onInput={inputHandler}
            />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
