import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Icon, Input } from 'react-native-elements';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import ChatListItem from '../components/ChatListItem';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons'
import { auth, db } from '../firebase';
import { AntDesign } from "@expo/vector-icons";
import { collection, onSnapshot, where, query } from 'firebase/firestore';

const SearchScreen = ({ navigation }) => {
    // Отслеживаем и обрабатываем изменения списка чатов
    const [chats, setChats] = useState([]);
    const [input, setInput] = useState('');

    // При выходе из учетки возвращаемся на экран Login
    const signOut = () => {
        auth.signOut().then(() => {
            navigation.replace("Login");
        });
    };
    //
    useEffect(() => {
        const q = query(collection(db, "chats"), where("chatName", '!=', ""));
        const unsubscribe = onSnapshot(q, (querySnaphots) => {
            const chats = [];
            querySnaphots.forEach((doc) => {
                chats.push({
                    id: doc.id,
                    data: doc.data()
                });
            });
            console.log(chats);
            setChats(chats);
        });
        return unsubscribe;
    }, [])

    // Перед отрисовкой UI настраиваем содержимое верхней плашки
    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Search Chat",
            headerStyle: { backgroundColor: "#fff" },
            headerTitleStyle: { color: "black" },
            // Задаем разметку частей слева и справа от заголовка
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <TouchableOpacity style={{ marginLeft: 5 }}
                        onPress={navigation.goBack}>
                        <AntDesign name="arrowleft" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            ),
            headerRight: () => (
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: 40,
                }}>
                    <TouchableOpacity onPress={signOut} activeOpacity={0.5}>
                        <Ionicons name='exit' size={24} color="black" />
                    </TouchableOpacity>
                </View>
            )
        })
    }, [navigation])

    const enterChat = (id, chatName) => {
        navigation.navigate("Chat", { id, chatName, })
    }

    const searchChat = (text) => {
        const q = query(collection(db, "chats"), where("chatName", '<=', text + '\uf8ff'), where("chatName", '>=', text));
        const unsubscribe = onSnapshot(q, (querySnaphots) => {
            const chats = [];
            querySnaphots.forEach((doc) => {
                chats.push({
                    id: doc.id,
                    data: doc.data()
                });
            });
            console.log(chats);
            setChats(chats);
        });
        return unsubscribe;
    }

    return (
        <SafeAreaView>
            <Input placeholder='Start to enter a chat name' value={input}
                onChangeText={(text) => {
                    setInput(text)
                    searchChat(text);
                }}
                leftIcon={<Icon name="wechat" type="antdesign" size={24} color="black" />} />
            <ScrollView style={styles.container}>
                {chats.map(({ id, data: { chatName } }) => (
                    <ChatListItem key={id} id={id} chatName={chatName} enterChat={enterChat} />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
};

export default SearchScreen

const styles = StyleSheet.create({
    container: {
        height: "100%"
    }
})