Project Description:
- What application does: 
This application allows users to research different movies based on a search term to help them decide what to watch. It provides key details such as movie title, year of release, average rating and movie tier (based on rating classification).
- MIS

APIs Used: 
- Names with links
OMDb - https://www.omdbapi.com
TMDb - https://www.themoviedb.org/u/maria0903

- Short Descriptions
Both: movie title 
OMDb: provides poster, year, imdb id
TMDb: average rating, title

Setup Instructions: 
- How to install
1. Clone Repository 
2. Navigate into project folder of "data-mashup"
3. Install dependencies such as react, axios

- How to run locally 
1. Navigate into client folder 
2. Input "npm run dev" 
3. Navigate into server folder
4. Input "node server.js"

Data Integration Explanation:
- Explain how data join works
The app integrates data from OMDb and TMDb using the movie title as the logical key.
- Include a short example
An example of this process is when a user searches for the movie title “Batman.” The application sends a GET request to both the OMDb API and the TMDb API using the search query as the key. If both APIs return matching or valid data for the same movie, the results are merged and displayed in a single movie card. 

Known Limitations: 
- Missing features
Some missing features consist of a user login and recommedation system. Depending on your preferences, you would be able to save what you wish to watch. 
- API Constraints
First, information found in one API may not be found in another. Hence, there might be missing movie data. Aside from that, OMDb has a limited amount of requests.
- Edge cases
There are some missing data in terms of movie images. To replace this, a white image placeholder has been placed. 