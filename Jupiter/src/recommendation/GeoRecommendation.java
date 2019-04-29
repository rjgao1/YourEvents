package recommendation;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import db.DBConnection;
import db.DBConnectionFactory;
import db.mysql.MySQLConnection;
import entity.Item;

// Recommendation based on geo distance and categories

public class GeoRecommendation {
	
	public List<Item> recommendItems(String userId, double lat, double lon) {
		List<Item> recommendedItems = new ArrayList<>();
		DBConnection connection = DBConnectionFactory.getConnection();
		
		// Step 1: get all favorited itemIds
		Set<String> favoritedItemIds = connection.getFavoriteItemIds(userId);
		
		// Step 2: get all categories, sort by count
		// {"sports": 5, "arts": 3, "music": 2}
		Map<String, Integer> allCategories = new HashMap<>();
		
		// assign count to each category
		for (String itemId : favoritedItemIds) {
			Set<String> categories = connection.getCategories(itemId);
			for (String category : categories) {
				allCategories.put(category, allCategories.getOrDefault(category, 0) + 1);
			}
		}
		
		List<Entry<String, Integer>> categoryList = new ArrayList<>(allCategories.entrySet());
		Collections.sort(categoryList, (Entry<String, Integer> c1, Entry<String, Integer> c2) -> 
							{
								return Integer.compare(c2.getValue(), c1.getValue());
							}
						);
		
		// Step 3: search based on category, filter out favorited items and add visited itemIds
		Set<String> visitedItemIds = new HashSet<>();
		
		for (Entry<String, Integer> category : categoryList) {
			List<Item> items = connection.searchItems(lat, lon, category.getKey());
			for (Item item : items) {
				if (!visitedItemIds.contains(item.getItemId()) && !favoritedItemIds.contains(item.getItemId())) {
					recommendedItems.add(item);
					visitedItemIds.add(item.getItemId());
				}
			}
		}
		
		connection.close();
		return recommendedItems;
		
	}
	
}
