import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { getDatabase, ref, onValue, update, remove } from 'firebase/database';

const AdminProjectScreen = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const projectsRef = ref(db, 'projects');

    const unsubscribe = onValue(projectsRef, snapshot => {
      const data = snapshot.val();
      const projectList = data 
        ? Object.keys(data).filter(key => !data[key].isValidated).map(key => ({ ...data[key], id: key })) 
        : [];
      setProjects(projectList);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const validateProject = async (projectId, isValidated) => {
    const db = getDatabase();
    const projectRef = ref(db, 'projects/' + projectId);

    if (isValidated) {
      // Se aprovado, atualize o status para validado
      await update(projectRef, { isValidated });
    } else {
      // Se rejeitado, exclua o projeto
      await deleteProject(projectId);
    }
  };

  const deleteProject = async (projectId) => {
    const db = getDatabase();
    const projectRef = ref(db, 'projects/' + projectId);

    try {
      await remove(projectRef);
      console.log('Projeto excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir o projeto: ', error);
    }
  };

  const renderProject = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.projectName}>{item.name}</Text>
      <Text style={styles.projectDescription}>{item.description}</Text>
      <Button title="Aprovar" onPress={() => validateProject(item.id, true)} />
      <Button title="Rejeitar" onPress={() => validateProject(item.id, false)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Projetos Pendentes de Validação</Text>
      <FlatList
        data={projects}
        renderItem={renderProject}
        keyExtractor={item => item.id}
      />
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
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  projectDescription: {
    fontSize: 14,
    marginTop: 5,
    color: '#666',
  },
});

export default AdminProjectScreen;
