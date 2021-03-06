package db;

import java.util.List;
import java.util.Set;

import entity.Item;

public interface DBConnection {
	/**
	 * Close the connection
	 */
	public void close();
	
	/**
	 * Insert the favorite items for a user.
	 * 
	 * @param userId
	 * @param itemIds
	 */
	public void setFavoriteItems(String userId, List<String> itemIds);
	
	/**
	 * Unset the favorite items for a user.
	 * 
	 * @param userId
	 * @param itemIds
	 */
	public void unsetFavoriteItems(String userId, List<String> itemIds);
	
	/** 
	 * Get favorite Items for a user.
	 * 
	 * @param userId
	 * @return Set<Item>: a HashSet of favorite items for a user
	 */
	public Set<Item> getFavoriteItems(String userId);
	
	/**
	 * Get favorite itemIds for a user.
	 * @param userId
	 * @return Set<String>: a HashSet of favorite itemIds for a user
	 */
	public Set<String> getFavoriteItemIds(String userId);
	
	/** 
	 * Get categories based on an itemId
	 * 
	 * @param itemId
	 * @return set of categories
	 */
	public Set<String> getCategories(String itemId);
	
	/**
	 * Search items based on geolocation and a term (optional) for a user
	 * 
	 * @param userId
	 * @param lat
	 * @param lon
	 * @param term
	 * 		(Nullable)
	 * @return list of items
	 */
	public List<Item> searchItems(double lat, double lon, String term);
	
	/** Save item into db
	 * 
	 * @param itemId
	 */
	public void saveItem(Item item);
	
	/** 
	 * Get the full name of a user based on userId
	 * 
	 * @param userId
	 * @return full name of the user
	 */
	public String getFullName(String userId);
	
	/** 
	 * Return whether the credential is correct
	 * 
	 * @param userId
	 * @param password
	 * @return boolean
	 */
	public boolean verifyLogin(String userId, String password);
	
	/**
	 * Register one user
	 * 
	 * @param userId
	 * @param password
	 * @param firstname
	 * @param lastname
	 * @return boolean
	 */
	public boolean registerUser(String userId, String password, String firstname, String lastname);
}













