import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput } from 'react-native';

import styles from './styles';
import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../../services/api';

function TeacherList() {

    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    const [teachers, setTeachers] = useState([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [subject, setSubject] = useState('');
    const [week_day, setWeekDay] = useState('');
    const [time, setTime] = useState('');

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {

                const favoritedTeachers = JSON.parse(response);
                const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
                    return teacher.id;
                });

                setFavorites(favoritedTeachersIds);
            }
        });
    }


    async function handleFiltersSubmit(){

        loadFavorites();

        const response = await api.get('classes', {
            params: {

                subject,
                week_day,
                time,

            }

        });

        setIsFiltersVisible(false);
        setTeachers(response.data);

    }


    function handleToggleFiltersVisible() {
        setIsFiltersVisible(!isFiltersVisible);
    }

    return (
    <View style={styles.container}>
        <PageHeader 
            title="Proffys disponiveis" 
            headerRight={(
                <BorderlessButton onPress={handleToggleFiltersVisible}>
                    <Feather name="filter" size={20} color="#FFF" />
                </BorderlessButton>
            )}
        >

        { isFiltersVisible && (


            <View style={styles.searcheForm}>
                <Text style={styles.label}>Mat??ria</Text>
                <TextInput
                    style={styles.input}
                    value={subject}
                    onChangeText={text => {setSubject(text)}}
                    placeholder="Qual a mat??ria?"
                    placeholderTextColor="#c1bccc"
                />

                <View style={styles.inputGroup}>
                    <View style={styles.inputBlock}>

                    <Text style={styles.label}>Dia da Semana</Text>
                    <TextInput
                        style={styles.input}
                        value={week_day}
                        onChangeText={text => {setWeekDay(text)}}
                        placeholder="Qual o dia?"
                        placeholderTextColor="#c1bccc"
                    />

                    </View>

                    <View style={styles.inputBlock}>

                    <Text style={styles.label}>Hor??rio</Text>
                    <TextInput
                        style={styles.input}
                        value={time}
                        onChangeText={text => {setTime(text)}}
                        placeholder="Qual hor??rio?"
                        placeholderTextColor="#c1bccc"
                    />

                    </View>
                </View>

                <RectButton onPress={handleFiltersSubmit} style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>Filtrar</Text>
                </RectButton>
            </View>
        )}
        </PageHeader>

        <ScrollView
            style={styles.teacherList}
            contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 16,
            }}
        >
            {teachers.map((teacher: Teacher ) => {
                    return (
                        <TeacherItem 
                            key={teacher.id} 
                            teacher={teacher} 
                            favorited={favorites.includes(teacher.id)}
                        />)
            })}

        </ScrollView>
    </View>
    );
}

export default TeacherList;