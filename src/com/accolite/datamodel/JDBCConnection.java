package com.accolite.datamodel;

public class JDBCConnection {

	String driver;
	String url;
	String username;
	String password;
	public String getDriver() {
		return driver;
	}
	public void setDriver(String driver) {
		this.driver = driver;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	@Override
	public String toString() {
		return "JDBCConnection [driver=" + driver + ", url=" + url + ", username=" + username + ", password=" + password
				+ "]";
	}
}
