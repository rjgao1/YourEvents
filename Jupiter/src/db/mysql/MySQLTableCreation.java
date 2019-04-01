package db.mysql;

import java.sql.DriverManager;
import java.sql.Statement;
import java.lang.reflect.InvocationTargetException;
import java.sql.Connection;

public class MySQLTableCreation {
	// Run this as java application to reset db schema
	public static void main(String[] args) {
		try {
			//Step 1: connect to MySQL
			System.out.println("Connection to" + MySQLDBUtil.URL);
			Class.forName("com.mysql.cj.jdbc.Driver").getConstructor().newInstance();
			Connection conn = DriverManager.getConnection(MySQLDBUtil.URL);
			
			if (conn == null) {
				return;
			}
			
			//Step 2: drop tables in case they exist
			Statement statement = conn.createStatement();
			String sql = "DROP TABLE IF EXISTS categories";
			statement.executeUpdate(sql);
			
			sql = "DROP TABLE IF EXISTS history";
			statement.executeUpdate(sql);
			
			sql = "DROP TABLE IF EXISTS items";
			statement.executeUpdate(sql);
			
			sql = "DROP TABLE IF EXISTS user";
			statement.executeUpdate(sql);
			
			conn.close();
			System.out.println("Import done successfully.");
		} catch(Exception e) {
			//TODO: auto-generated catch block
			e.printStackTrace();
		}
		
		
	}
}
