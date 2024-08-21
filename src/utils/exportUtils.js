import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

// Function to export to .txt
export const exportToTxt = async (todoList) => {
    const content = todoList.map((item) => `- ${item.title}`).join('\n');
    const fileUri = `${FileSystem.documentDirectory}todo-list.txt`;

    try {
        await FileSystem.writeAsStringAsync(fileUri, content);
        await Sharing.shareAsync(fileUri);
    } catch (error) {
        console.error('Error exporting to .txt:', error);
    }
};

// Function to export to .pdf
export const exportToPdf = async (todoList) => {
    const content = todoList.map((item) => `<p>- ${item.title}</p>`).join('');
    const htmlContent = `<html><body>${content}</body></html>`;

    try {
        const { uri } = await Print.printToFileAsync({ html: htmlContent });
        await Sharing.shareAsync(uri);
    } catch (error) {
        console.error('Error exporting to .pdf:', error);
    }
};
