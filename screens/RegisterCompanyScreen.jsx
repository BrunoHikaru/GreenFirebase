// screens/RegisterCompanyScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, firestore, storage } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const RegisterCompanyScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [socialObject, setSocialObject] = useState('');
  const [headquarters, setHeadquarters] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
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

  const handleRegister = async () => {
    try {
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

      // Salva os dados da empresa no Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        name: name,
        email: email,
        socialObject: socialObject,
        headquarters: headquarters,
        phone: phone,
        photoURL: photoURL, // Adiciona URL da imagem
        userType: "Empresa",
      });

      console.log('Registro de empresa concluído com sucesso');
      navigation.navigate('Login');
    } catch (error) {
      console.error("Erro ao registrar empresa:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Empresa</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Objeto Social"
        value={socialObject}
        onChangeText={setSocialObject}
      />
      <TextInput
        style={styles.input}
        placeholder="Sede"
        value={headquarters}
        onChangeText={setHeadquarters}
      />
      <TextInput
        style={styles.input}
        placeholder="Telemóvel"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Escolher Foto de Perfil" onPress={handleImagePick} />
      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.imagePreview} />}
      <Button title="Registrar" onPress={handleRegister} />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop:hp(15)
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginVertical: 15,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default RegisterCompanyScreen;
