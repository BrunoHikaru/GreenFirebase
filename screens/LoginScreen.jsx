import React from 'react';
import { View, Button } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { auth, firestore } from '../firebase';  // Certifique-se de que está importando corretamente
import AuthForm from '../components/AuthForm';

export default function LoginScreen({ navigation }) {
  const handleLogin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Buscar o tipo de usuário no Firestore
      const docRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userType = docSnap.data().userType;
        console.log("Tipo de usuário: ", userType);

        let destinationScreen = '';

        // Navegação condicional com base no tipo de usuário
        if (userType === 'Voluntário') {
          destinationScreen = 'Volunteer';
        } else if (userType === 'Empresa') {
          destinationScreen = 'Company';
        } else if (userType === 'Administrador') {
          destinationScreen = 'Admin';
        } else {
          console.error('Tipo de usuário desconhecido!');
          return;  // Impede a navegação se o tipo de usuário for desconhecido
        }

        // Redefine a pilha de navegação após o login bem-sucedido
        navigation.reset({
          index: 0,
          routes: [{ name: destinationScreen }],
        });
      } else {
        console.log("Nenhum documento encontrado!");
      }
    } catch (error) {
      console.error("Erro ao fazer login: ", error);
    }
  };

  return (
    <View  style={{marginTop:150}}>
      <AuthForm onSubmit={handleLogin} buttonText="Login" />
      <Button title="Não tem uma conta? Registre-se" onPress={() => navigation.navigate('Register')} />
      <Button title="Registrar como Empresa" onPress={() => navigation.navigate('RegisterCompany')} />
    </View>
  );
}
