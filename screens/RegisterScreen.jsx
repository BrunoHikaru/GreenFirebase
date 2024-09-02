import React, { useState } from 'react';
import { View, Button, Image, Text, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, firestore, storage } from '../firebase';
import AuthForm from '../components/AuthForm';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const handleImagePick = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        console.log('Imagem selecionada:', result.assets[0].uri);
        setSelectedImage(result.assets[0].uri);
      } else {
        console.log('Seleção de imagem cancelada');
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      setErrorMessage('Erro ao selecionar imagem');
    }
  };

  const handleRegister = async (email, password, userType) => {
    try {
      console.log('Tentando registrar usuário com email:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let photoURL = '';
      if (selectedImage) {
        console.log('Iniciando upload da imagem...');

        const response = await fetch(selectedImage);
        console.log('Resposta do fetch:', response);

        if (!response.ok) {
          throw new Error('Erro ao fazer fetch da imagem: ' + response.status);
        }

        const blob = await response.blob();
        console.log('Blob criado com sucesso:', blob);

        // Referência do Firebase Storage
        const storageRef = ref(storage, `profilePictures/${user.uid}.jpg`);
        await uploadBytes(storageRef, blob);
        console.log('Upload concluído');

        photoURL = await getDownloadURL(storageRef);
        console.log('URL da imagem:', photoURL);
      }

      // Salva os dados do usuário no Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        email: user.email,
        userType: userType,
        photoURL: photoURL,
      });

      console.log('Registro concluído com sucesso');
      navigation.navigate('Login');
    } catch (error) {
      console.error("Erro ao registrar:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <View>
      <AuthForm onSubmit={handleRegister} buttonText="Registrar" />
      <Button title="Escolher Foto de Perfil" onPress={handleImagePick} />
      {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: 100, height: 100 }} />}
      <Button title="Já tem uma conta? Faça Login" onPress={() => navigation.navigate('Login')} />
      {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
    </View>
  );
};

export default RegisterScreen;
