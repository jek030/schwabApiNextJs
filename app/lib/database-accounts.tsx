import { IPost } from './utils';
import { IAccount,IInsertAccount } from './utils';
import mysql from 'mysql2/promise';

export async function getDbAccounts(): Promise<IAccount[]> {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USERNAME,
      password:  process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    });

    console.log("Querying from table dailyaccountvalue...")

    const [rows] = await connection.query<IAccount[]>(
      'select v.accountNumber, v.roundTrips, v.accountValue, v.accountEquity, v.cashBalance, v.date from dailyaccountvalue v' 
    );
    return rows;
  }

  export async function insertAccount(acc: IInsertAccount): Promise<number> {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USERNAME,
      password:  process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    });

      const [result] = await connection.query<mysql.ResultSetHeader>(
        'INSERT INTO dailyaccountvalue (accountNumber, roundTrips, accountValue, accountEquity, cashBalance, date) VALUES (?,?,?,?,?,?) ',
        [acc.accountNumber, acc.roundTrips, acc.accountValue, acc.accountEquity, acc.cashBalance, acc.date]
      );
    
    console.log(result)//todo remove
    await connection.end();
    return result.insertId;
  }

   //try {
  //  const newPost: IPost = {
  //    id:126,
  //    content: 'john@example.com',
  //  };
  //  const insertId =  insertPost(newPost);
  //  console.log(`New user inserted with ID: ${insertId}`);
  //} catch (error) {
  //  console.error('Error:', error);
  //}