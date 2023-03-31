import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("little_lemon_fa");

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "create table if not exists menuitems (name text primary key not null, price text, description text, image text, category text);"
        );
      },
      reject,
      resolve
    );
  });
}

export async function getMenuItems() {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql("select * from menuitems", [], (_, { rows }) => {
        resolve(rows._array);
      });
    });
  });
}

export function saveMenuItems(menuItems) {
  db.transaction((tx) => {
    let insertIntoStatement = "INSERT INTO menuitems VALUES ";
    menuItems.forEach((item) => {
      item.price = `$${item.price.toFixed(2)}`;

      insertIntoStatement += `('${item.name}', '${
        item.price
      }', '${item.description.replace("'", "''")}', '${item.image}', '${
        item.category
      }'),`;
    });
    // Cut last comma
    insertIntoStatement = insertIntoStatement.slice(0, -1);

    tx.executeSql(insertIntoStatement);
  });
}

export async function filterByQueryAndCategories(query, activeCategories) {
  // Add single quotes for later query integration
  for (let index = 0; index < activeCategories.length; index++) {
    activeCategories[index] = "'" + activeCategories[index] + "'";
  }
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM menuitems WHERE LOWER(name) LIKE '%${query}%' AND LOWER(category) IN (${activeCategories.join(
          ","
        )})`,
        [],
        (_, { rows }) => {
          resolve(rows._array);
        }
      );
    });
  });
}
