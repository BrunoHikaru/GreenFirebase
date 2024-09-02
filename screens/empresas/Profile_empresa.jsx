import React, { useEffect, useState } from 'react';
import { Text, View, Image, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { auth, firestore } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const Profile_empresas = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Obtém o usuário autenticado
        const user = auth.currentUser;

        if (user) {
          // Busca os dados do usuário no Firestore
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));

          if (userDoc.exists()) {
            // Atualiza o estado com os dados do usuário
            setUserData(userDoc.data());
          } else {
            console.error('Nenhum documento encontrado para o usuário');
          }
        }
      } catch (error) {
        console.error('Erro ao buscar os dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View>
      <View style={styles.header}>
        <Text style={{textAlign: 'center', fontSize: wp(5), fontWeight: 'bold', color: 'white',
           marginTop:  Platform.OS==='android'?hp(4):hp(4)+ Platform.OS==='ios'?hp(15):hp(5),}}>Perfil</Text>
      </View>
      {userData ? (
        <>
          <View>
            <Image
              source={{ uri: userData.photoURL }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          </View>
          <Text>Email: {userData.email}</Text>
          <Text>User Type: {userData.userType}</Text>
        </>
      ) : (
        <Text>Erro ao carregar os dados do usuário</Text>
      )}
    </View>
  );
};

const styles=StyleSheet.create({
  header:{
    width: wp(100),
    height: hp(13),

    borderWidth: wp(0.5),
    borderColor: 'black',
    marginTop: hp(0),
    marginBottom: hp(3),
    borderBottomLeftRadius:wp(7),
    borderBottomRightRadius:wp(7),
    backgroundColor: '#3D550C',
  },
})

export default Profile_empresas;
