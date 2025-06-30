import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';  // Import Material Icons
import FileViewer from 'react-native-file-viewer';
import RNFetchBlob from 'rn-fetch-blob';
import Head from './Header';

const viewDocument = (items) => {
    const localFile = `${RNFetchBlob.fs.dirs.DocumentDir}/${items.filename}.pdf`;
    RNFetchBlob.config({ path: localFile })
        .fetch('GET', items.url)
        .then(() => FileViewer.open(localFile))
        .catch(error => console.error(error));
};

// const downloadDocument = (items) => {
//     const { config, fs } = RNFetchBlob;
//     let DownloadDir = fs.dirs.DownloadDir;
//     let filePath = `${DownloadDir}/${items.filename}.pdf`;
//     config({ addAndroidDownloads: { useDownloadManager: true, title: 'Downloading', path: filePath, notification: true, overwrite: true } })
//         .fetch('GET', items.url)
//         .then(() => console.log('Download Complete', filePath))
//         .catch(error => console.error(error));
// };


const downloadDocument = (items) => {
    const { config, fs } = RNFetchBlob;
    let DownloadDir = fs.dirs.DownloadDir;
    let filePath = `${DownloadDir}/${items.filename}.pdf`;
  
    // Show toast saying download started
    ToastAndroid.show('Downloading started...', ToastAndroid.SHORT);
  
    config({
      addAndroidDownloads: {
        useDownloadManager: true,
        title: 'Downloading',
        path: filePath,
        notification: true,
        overwrite: true,
      },
    })
      .fetch('GET', items.url)
      .then(() => {
        // Show toast saying download complete
        ToastAndroid.show('PDF downloaded successfully!', ToastAndroid.SHORT);
        console.log('Download Complete', filePath);
      })
      .catch((error) => {
        console.error(error);
        // Optionally, show a failure toast here
        ToastAndroid.show('Download failed. Please try again.', ToastAndroid.LONG);
      });
  };

const LoanDocumentsScreen = ({navigation,route}) => {
  const [data, setData] = useState(route?.params?.datas || '');
  console.log(data)


    return (
        <View style={styles.container}>
            <Head title="Documents" />
            <View style={styles.container1}>
                <View style={styles.card}>
                    <Text style={styles.loanId}>{data.loanNum}</Text>
                    <View style={styles.statusContainer}>
                        <Text style={styles.statusText}>Closed on {data.close}</Text>
                    </View>
                    <FlatList
                        data={data.doc}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.card1}>
                                <View style={styles.cardContent}>
                                    <View>
                                        <Text style={styles.title}>{item.title}</Text>
                                        <Text style={styles.date}>{item.date}</Text>
                                    </View>
                                    <View style={styles.iconContainer}>
                                        <TouchableOpacity onPress={() => viewDocument(item)}>
                                            <MaterialIcons name="remove-red-eye" size={24} color="black" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => downloadDocument(item)}>
                                            <MaterialIcons name="download" size={24} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    container1: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
    },
    loanId: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    statusContainer: {
        backgroundColor: '#F2F2F2',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    statusText: {
        fontSize: 14,
        color: 'gray',
    },
    card: { backgroundColor: "#FFF", padding: 12, borderRadius: 10, marginBottom: 16, elevation: 5, shadowColor:'#000' },
    card1: { padding: 8, borderRadius: 10, marginBottom: 16, backgroundColor: '#F4EDFF', borderWidth:1, borderColor:'#6E36BC' },
    // card: {
    //     marginBottom: 8,
    //     padding: 12,
    //     backgroundColor: 'white',
    //     borderRadius: 8,
    // },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 14,
        color: 'gray',
    },
    iconContainer: {
        flexDirection: 'row',
        gap: 10,
    },
});

export default LoanDocumentsScreen;
