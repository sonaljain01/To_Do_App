import AsyncStorage from '@react-native-async-storage/async-storage';

// save ToDo List to AsyncStorage
export const saveTodoList = async (todoList) => {
    try{
        const jsonValue = JSON.stringify(todoList);
        await AsyncStorage.setItem('@todo_list', jsonValue);

    } 
    catch (e) {
        console.error("Fail to save the ToDo list to Async storage", e);
    }
};

export const loadTodoList = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@todo_list');
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    }
    catch (e) {
        console.error("Fail to load the ToDo list to Async storage", e);
        return [];
    }
};