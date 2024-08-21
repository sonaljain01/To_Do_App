import { StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { IconButton } from 'react-native-paper';
import Fallback from '../components/Fallback';
import { saveTodoList, loadTodoList } from '../utils/storage';
import { exportToPdf, exportToTxt } from '../utils/exportUtils';


// test by adding dummy data
// const dummyData = [
//     { id: "01", title: "Wash car" },
//     { id: "02", title: "Read books" }
// ];

const ToDoScreen = () => {
    // Init local states
    const [todo, setTodo] = useState("");
    const [todoList, setTodoList] = useState([]);
    const [editedTodo, setEditedTodo] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [highlightedId, setHighlightedId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const fetchTodoList = async () => {
            setLoading(true);
            setError(null);
            try {
                const loadedTodoList = await loadTodoList();
                setTodoList(loadedTodoList);
            }
            catch (e){
                setError("Failed to load Todos");
            }
            finally{
                setLoading(false);
            }
        };
        fetchTodoList();
    }, []);

    useEffect(() => {
        // Save the todo list to AsyncStorage whenever it changes
        saveTodoList(todoList);
    }, [todoList]);

    //Handle Add Todo
    const handleAddTodo = () => {

        //structure of a single todo item
        // {
        //     id:
        //     title:

        // }

        if (todo === "") {
            return;  //early return
        }

        setTodoList([...todoList, { id: Date.now().toString(), title: todo }]);   // use to give todo a unique id Date.now().toString()
        setTodo("");
    };


    //Handle Delete Todo
    const handleDeleteTodo = (id) => {
        const updatedTodoList = todoList.filter((todo) => todo.id !== id)

        setTodoList(updatedTodoList);
    };

    //Handle Edit
    const handleEditTodo = (todo) => {
        setEditedTodo(todo);
        setTodo(todo.title);
    };

    //Handle Update
    const handleUpdatedTodo = () => {
        const updatedTodos = todoList.map((item) => {
            if (item.id === editedTodo.id) {
                return { ...item, title: todo };
            }
            return item;

        });

        setTodoList(updatedTodos);
        setEditedTodo(null);
        setTodo("");
    };

    // Handle Search
    const handleSearch = () => {
        const foundTodo = todoList.find((item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (foundTodo) {
            setHighlightedId(foundTodo.id); // highlight the found task
        } else {
            Alert.alert("Task Not Found", "No task matches your search.");
            setHighlightedId(null); // clear the highlight if not found
        }
        setLoading(false);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        setError(null);
        try {
            const refreshedTodoList = await loadTodoList();
            setTodoList(refreshedTodoList);
        } catch (e) {
            setError('Failed to refresh todos');
        } finally {
            setRefreshing(false);
        }
    };

    // Render Todos
    const renderTodos = ({ item, index }) => {
        const isHighlighted = item.id === highlightedId;

        if (isHighlighted) {
            console.log(`Item with id ${highlightedId} is highlighted`); // Example explicit usage
        }
        return (
            <View style={[styles.itemContainer, isHighlighted && styles.highlightedItem]}>
                {/* <View style={styles.itemContainer}> */}
                <Text style={styles.itemText}>{item.title}</Text>
                <IconButton icon="pencil" iconColor='black' onPress={() => handleEditTodo(item)} />
                <IconButton icon="delete" iconColor='black' onPress={() => handleDeleteTodo(item.id)} />
            </View>
        );
    };

    const handleExportTxt = async () => {
        try {
            await exportToTxt(todoList);
        } catch (error) {
            console.error('Failed to export to txt', error);
            Alert.alert('Export failed', 'An error occurred while exporting the file.');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Add a task"
                value={todo}
                onChangeText={(userText) => setTodo(userText)}
            />


            {editedTodo ? <TouchableOpacity style={styles.addButton}
                onPress={() => handleUpdatedTodo()}
            >

                <Text style={styles.addButtonText}>Save</Text>
            </TouchableOpacity> :
                <TouchableOpacity style={styles.addButton}
                    onPress={() => handleAddTodo()}
                >

                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
            }

            {/* Search Section */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search tasks"
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                />
                <TouchableOpacity style={styles.searchButton} onPress={() => handleSearch()}>
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.exportContainer}>
                <TouchableOpacity style={styles.exportButton} onPress={() => exportToTxt(todoList)}>
                    <Text style={styles.exportButtonText}>Export to .txt</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.exportButton} onPress={() => exportToPdf(todoList)}>
                    <Text style={styles.exportButtonText}>Export to .pdf</Text>
                </TouchableOpacity>
            </View>

            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {error && <Text style={styles.errorText}>{error}</Text>}
            {refreshing && <ActivityIndicator size="large" color="#00ff00" />}

            {/* Render To Do List */}
            <FlatList
                data={todoList}
                renderItem={renderTodos}
                keyExtractor={(item) => item.id}
                onRefresh={handleRefresh}
                refreshing={refreshing}
            />

            {
                todoList.length <= 0 && <Fallback />
            }
        </View>
    );
};

export default ToDoScreen;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginTop: 50,
    },
    input: {
        borderWidth: 2,
        borderColor: "#0e86d4",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,

    },
    addButton: {
        backgroundColor: 'black',
        borderRadius: 6,
        paddingVertical: 8,
        marginTop: 24,
        marginBottom: 24,
        alignItems: "center",
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        borderWidth: 2,
        borderColor: "#0e86d4",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    searchButton: {
        backgroundColor: '#0e86d4',
        borderRadius: 60,
        paddingVertical: 5,
        paddingHorizontal: 16,
        marginLeft: 8,
    },
    searchButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    itemContainer: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: "skyblue",
        marginTop: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 5,
    },
    highlightedItem: {
        backgroundColor: 'green', // highlight color
    },
    itemText: {
        fontSize: 18,
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
    },
    exportContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    exportButton: {
        backgroundColor: '#0e86d4',
        borderRadius: 6,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    exportButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginVertical: 10,
        textAlign: 'center',
    },
});

