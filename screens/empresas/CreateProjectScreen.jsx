import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Button, TouchableOpacity, Image } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import RNPickerSelect from 'react-native-picker-select';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, set } from "firebase/database";
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../../firebase';

const CreateProjectScreen = ({ navigation }) => {
  const { control, handleSubmit } = useForm();
  const [imageUri, setImageUri] = useState(null);

  const onSubmit = async (data) => {
    const storage = getStorage();
    const db = getDatabase();
    const user = auth.currentUser;

    if (!user) {
      alert('Usuário não autenticado.');
      return;
    }

    // Upload da Imagem
    let imageUrl = '';
    if (imageUri) {
      try {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const imageRef = ref(storage, `projects/${Date.now()}-${data.name}.jpg`);
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      } catch (error) {
        console.error('Erro ao fazer upload da imagem: ', error);
      }
    }

    // Salvando no Firebase Realtime Database
    const projectRef = dbRef(db, 'projects/' + Date.now());
    set(projectRef, {
      ...data,
      imageUrl: imageUrl || null,
      dateCreated: new Date().toISOString(),
      isValidated: false,
      creatorId: user.uid,
    });

    navigation.navigate('Perfil');
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Desculpe, precisamos de permissão para acessar a galeria!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const cities = {
    "Norte": ["Porto", "Braga", "Guimarães", "Viana do Castelo", "Bragança"],
    "Centro": ["Coimbra", "Aveiro", "Leiria", "Viseu"],
    "Lisboa e Vale do Tejo": ["Lisboa", "Sintra", "Cascais", "Oeiras"],
    "Alentejo": ["Évora", "Beja", "Portalegre", "Elvas"],
    "Algarve": ["Faro", "Albufeira", "Portimão", "Lagos"],
    "Açores": ["Ponta Delgada", "Angra do Heroísmo", "Horta"],
    "Madeira": ["Funchal"]
  };

  const cityItems = Object.entries(cities).flatMap(([region, cityList]) =>
    cityList.map(city => ({ label: `${city} (${region})`, value: city }))
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Criar Novo Projeto</Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Nome do Projeto"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="company"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Nome da Empresa"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Descrição do Projeto"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            multiline={true}
            numberOfLines={4}
          />
        )}
      />

      <Controller
        control={control}
        name="role"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Cargo"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="executionMode"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Modo de Execução (ex: Presencial, Remoto, Híbrido)"
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="startDate"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Data de Início"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="reducedMobility"
        render={({ field: { onChange, value } }) => (
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Tem mobilidade reduzida?</Text>
            <RNPickerSelect
              onValueChange={onChange}
              value={value}
              items={[
                { label: 'Não', value: 'não' },
                { label: 'Sim', value: 'sim' },
              ]}
              style={pickerSelectStyles}
            />
          </View>
        )}
      />

      {/* Adicionando o campo de seleção da cidade */}
      <Controller
        control={control}
        name="city"
        render={({ field: { onChange, value } }) => (
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Cidade</Text>
            <RNPickerSelect
              onValueChange={onChange}
              value={value}
              items={cityItems}
              style={pickerSelectStyles}
              placeholder={{ label: "Selecione uma cidade", value: null }}
            />
          </View>
        )}
      />

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>Selecionar Imagem</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

      <Button title="Criar Projeto" onPress={handleSubmit(onSubmit)} />
    </ScrollView>
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
    color: '#333',
    marginBottom: 20,
    marginTop: 50,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    marginLeft: 10,
  },
  imageButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  imageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 20,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
  },
});

export default CreateProjectScreen;
