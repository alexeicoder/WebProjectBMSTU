import React, { useState, useEffect } from 'react';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Form from '../../components/Form/Form';
import styles from './SettingsPage.module.css';
import Label from '../../components/Label/Label';
import FormElement from '../../components/FormElement/FormElement';
import Checkbox from '../../components/Checkbox/Checkbox';
import { ROUTES } from '../../routes/routes';
import FormMessageBlock from '../../components/FormMessageBlock/FormMessageBlock';
import PageLayout from '../../components/PageLayout/PageLayout';

interface UserData {
  id: number;
  name: string;
  login: string;
  password?: string; // Password is optional for display
}

const SettingsPage: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserId = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // First, validate token to get userId
        const validateResponse = await fetch('http://192.168.0.15:3000/api/auth/validateToken', {
          method: 'GET',
          credentials: 'include', // This sends cookies
        });

        if (!validateResponse.ok) {
          throw new Error('Не удалось проверить токен. Пожалуйста, войдите снова.');
        }

        const validateResponseData = await validateResponse.json();

        const userId = validateResponseData.userId;
        setUserId(userId);

        // Then fetch user data
        const userResponse = await fetch(`http://192.168.0.15:3000/api/auth/data/${userId}`);
        if (!userResponse.ok) {
          throw new Error('Не удалось загрузить данные о пользователе. Войдите снова.');
        }
        const data: UserData = await userResponse.json();
        setUserData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load user data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserId();
  }, []);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setUserData((prevData) =>
      prevData ? { ...prevData, [name]: value } : null
    );
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setChangePassword(false);
  };

  const handleSaveClick = async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);
    try {
      if (!userData) {
        throw new Error('No user data to update');
      }
      const updateData = {
        name: userData.name,
        login: userData.login,
        password: changePassword ? userData.password : undefined,
      };
      const response = await fetch(`http://192.168.0.15:3000/api/auth/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // This ensures cookies are sent
        body: JSON.stringify(updateData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user data');
      }
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save user data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setChangePassword(false);
  };

  const handleChangePasswordClick = () => {
    setChangePassword(!changePassword);
  };

  const handleDeleteClick = async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://192.168.0.15:3000/api/auth/delete/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user data');
      }
      setIsDeleted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user data.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className={styles.layout}>Загрузка...</div>;
  }

  if (error) {
    return (
      <>
        {/* <div className={styles.layout}> */}
        <PageLayout>
          <FormMessageBlock message={error} type='error' />
          <Button type="button" onClick={() => {
            window.location.reload();
          }}>
            ОК
          </Button>
        </PageLayout>
        {/* </div> */}
      </>
    );
  }

  if (isDeleted) {
    return (
      <>
        <div className={styles.layout}>Аккаунт успешно удален
          <p></p>
          <Button type="button" onClick={() => {
            window.location.href = ROUTES.WELCOME;
          }}>
            ОК
          </Button>
        </div>
      </>
    )
  }

  if (!userData || !userId) {
    return <div>User data not found.</div>;
  }

  return (
    <div className={styles.layout}>
      <Form head={"Настроить профиль"}>
        <FormElement>
          <Label htmlFor="name">Имя:</Label>
          {isEditing ? (
            <Input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
            />
          ) : (
            <Input value={userData.name} disabled={true} />
          )}
        </FormElement>
        <FormElement>
          <Label htmlFor="login">Логин:</Label>
          {isEditing ? (
            <Input
              type="text"
              id="login"
              name="login"
              value={userData.login}
              onChange={handleInputChange}
            />
          ) : (
            <Input value={userData.login} disabled={true} />
          )}
        </FormElement>
        {isEditing && (
          <>
            <FormElement>
              <Checkbox
                checkboxId='changePassword'
                labelText={'Изменить пароль'}
                onClick={handleChangePasswordClick}
                checked={changePassword}
              />
            </FormElement>
            {changePassword && (
              <FormElement>
                <Label htmlFor="password">Пароль:</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={userData.password || ''}
                  onChange={handleInputChange}
                />
              </FormElement>
            )}
          </>
        )}
        <FormElement>
          {isEditing ? (
            <>
              <Button type="button" onClick={handleSaveClick} disabled={isLoading} className='signinBtn'>
                Сохранить
              </Button>
              <Button type="button" onClick={handleCancelClick} disabled={isLoading}>
                Отмена
              </Button>
            </>
          ) : (
            <Button type="button" onClick={handleEditClick} className='signinBtn'>
              Редактировать
            </Button>
          )}
        </FormElement>
        <FormElement>
          <Button type="button" onClick={handleDeleteClick} disabled={isLoading}>
            Удалить профиль
          </Button>
        </FormElement>
      </Form>
    </div>
  );
};

export default SettingsPage;
