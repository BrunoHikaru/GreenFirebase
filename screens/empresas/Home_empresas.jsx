import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { auth, database } from '../../firebase'; // Importando as instâncias configuradas
import { ref, onValue } from 'firebase/database'; // Importando as funções necessárias
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { RFPercentage } from 'react-native-responsive-fontsize';

export const Home_empresas = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;
  const navigation = useNavigation();

  useEffect(() => {
    if (user) {
      const userId = user.uid;
      const projectsRef = ref(database, 'projects');

      const unsubscribe = onValue(projectsRef, snapshot => {
        const data = snapshot.val();
        const projectList = data
          ? Object.keys(data)
              .filter(key => data[key].creatorId === userId && data[key].isValidated) // Filtra os projetos pelo creatorId e isValidated
              .map(key => ({ ...data[key], id: key }))
          : [];
        setProjects(projectList);
        setLoading(false);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  const renderProject = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      {/* Renderizando a imagem se estiver disponível */}
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.projectImage} />
      )}
      <Text style={styles.projectName}>{item.name}</Text>
      <Text style={styles.projectDescription}>{item.description}</Text>
      <Text style={styles.projectDetails}>Modo de Execução: {item.executionMode}</Text>
      <Text style={styles.projectDetails}>Data de Início: {item.startDate}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo, {user?.displayName || 'Empresa'}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Criar')} style={styles.buttonCriar}>
        <Text style={{ textAlign: 'center', color: 'white', fontSize: RFPercentage(2) }}>Criar Projeto</Text>
      </TouchableOpacity>
      <Text style={{fontSize:RFPercentage(2.7), marginBottom:hp(3), fontWeight:'bold'}}>Projetos Validados</Text>
      {loading ? (
        <Text>Carregando projetos...</Text>
      ) : projects.length === 0 ? (
        <Text>Você ainda não criou nenhum projeto.</Text>
      ) : (
        <FlatList
          data={projects}
          renderItem={renderProject}
          keyExtractor={item => item.id}
          horizontal={true} // Definindo o FlatList para ser horizontal
          showsHorizontalScrollIndicator={false} // Opcional: esconde o indicador de rolagem horizontal
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: hp(7)
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginRight: 15, // Margem à direita para espaçar os cartões horizontalmente
    elevation: 3,
    width: wp(80), // Defina a largura do cartão conforme necessário
    height: hp(35),
  },
  projectImage: {
    width: wp(73),
    height: hp(17),
    borderRadius: 10,
    marginBottom: 10,
  },
  projectName: {
    fontSize: RFPercentage(2.7),
    fontWeight: '500',
    marginBottom: hp(1),
    textAlign:'center'
  },
  projectDescription: {
    fontSize: 14,
    marginTop: 5,
    color: '#666',
  },
  projectDetails: {
    fontSize: 12,
    marginTop: 5,
    color: '#333',
  },
  buttonCriar: {
    backgroundColor: '#3d8a0c',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    borderColor: 'black',
    marginBottom: hp(3),
    borderWidth: 1
  }
});

export default Home_empresas;
