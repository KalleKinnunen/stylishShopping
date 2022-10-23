import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Keyboard } from 'react-native';
import * as SQLite from'expo-sqlite';
import { Button, Icon, ListItem, Header, Input } from 'react-native-elements'

export default function App() {

const [product, setProduct] = useState('');
const [amount, setAmount] = useState('');
const [data, setData] = useState([])

const db = SQLite.openDatabase('shoppingdb.db');


useEffect(() => {
  db.transaction(tx => {
    tx.executeSql(`create table if not exists shopping (id integer primary key not null, product text, amount text);`);
  }, null, updateList);
}, []);

const saveProduct = () => {
  Keyboard.dismiss()
  db.transaction(tx => {
    tx.executeSql(`insert into shopping (product, amount) values (?, ?);`,
      [product, amount]);
  }, null, updateList)
}

const updateList = () => {
  db.transaction(tx => {
    tx.executeSql(`select * from shopping;`, [], (_, { rows }) => 
    setData(rows._array)
    );
  }, null, null);
}

const deleteProduct = (id) => {
  db.transaction(tx => {
      tx.executeSql(`delete from shopping where id = ?;`, [id]);
    }, null, updateList);
}

const renderItem = (item) => {
  return (
    <ListItem
      bottomDivider pad={80} containerStyle={styles.listitem}>
      <View style={styles.listTitleAndSubtitle}>
        <ListItem.Title>{item.product}</ListItem.Title>
        <ListItem.Subtitle style={{ color: 'gray' }}>{item.amount}</ListItem.Subtitle>
      </View>
      <Icon type="material" name="delete-outline" color="red" onPress={() => deleteProduct(item.id)}></Icon>
    </ListItem>
  )
}


return (
  <View style={styles.container}>
    <Header
      containerStyle={{ height: 100 }}
      centerComponent={{ text: "SHOPPING LIST", style: { fontSize: 30, paddingTop: 5 } }}></Header>
    <View style={styles.inputs} >
      <Input placeholder="product" label="PRODUCT" value={product} onChangeText={product => setProduct(product)} returnKeyType="done"></Input>
      <Input placeholder="amount" label="AMOUNT" value={amount} onChangeText={amount => setAmount(amount)} returnKeyType="done"></Input>
    </View>
    <Button
      buttonStyle={styles.button}
      titleStyle={{ marginLeft: 10 }}
      title="SAVE"
      onPress={saveProduct}
      icon={
        <Icon
            type="material"
            name="shopping-cart"
            color='white'>
          </Icon>
      }></Button>

    <FlatList
      data={data}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => renderItem(item)}
    ></FlatList>

    <StatusBar style="auto" type="hidden" />
  </View>
);
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
},
inputs: {
  width: '100%',
  padding: 15,
  paddingBottom: 2
},
button: {
  width: 150,
  marginBottom: 15
},
listitem: {
  width: 350,
  alignItems: 'center',
  backgroundColor: '#E3ECF5',
  borderRadius: 10,
  justifyContent: 'flex-start'
},
listTitleAndSubtitle: {
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  width: 200
}

});
