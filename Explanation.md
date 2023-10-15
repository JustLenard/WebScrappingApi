## Efficiency

To boost efficiency in this project, I made some key decisions:

1.  **Optimized Data Structures:** I used Set and Map data structures extensively, tapping into
    their underlying hash tables. This choice proved invaluable, especially in tasks like data point
    existence checks and the sentiment detection algorithm. It ensured swift and resource-efficient
    operations.
1.  **Singleton Pattern:** I adopted the singleton pattern for the sentiment detection algorithm. By
    reusing the same instance for multiple get requests, I minimized the overhead of creating a new
    hash map with 3000+ key-value pairs each time, which can be quite resource-intensive.

## Stand out features implemented.

Here are the standout features I integrated into the project:

1.  **Expanded Data Scraping:** The project allows for the extraction of 11 distinct data points,
    including article content, author information, category, and publication date.

2.  **User-Friendly Data Selection:** I added a dropdown menu for selecting specific data points to
    scrape, enhancing the user experience by offering flexibility and ease of use.

3.  **Visual Data Representation:** The project goes beyond data collection and presents information
    in an elegant and visually appealing manner, aiding users in quickly interpreting the data.

## Standout Features Proposal

Looking ahead, several exciting features can be added to improve the app:

1.  **Custom Data Volume Selection:** I plan to give users the ability to choose the number of
    articles they want to scrape, catering to a wider range of use cases.

2.  **Clipboard Copy Button:** Adding a simple copy-to-clipboard button will streamline the process
    of sharing or saving scraped data.

3.  **Full Article Scraping:** An upcoming feature will allow users to scrape entire articles,
    providing comprehensive insights into content.

## Learning experience.

Throughout this project, I stepped out of my comfort zone to explore new technologies and
methodologies. My primary focus was on using Tailwind CSS, which was a game-changer. Its efficient
approach to writing CSS, along with the elimination of viewport-based media queries, made styling a
breeze.

I also appreciated the wealth of resources and pre-made components available within the Tailwind CSS
ecosystem, which accelerated development and improved the user interface.

However, I did face challenges, notably dealing with lengthy class names in Tailwind CSS. To address
this, I created custom components with predefined styles, resulting in more concise and manageable
class names.

In summary, this project provided an opportunity to embrace new technologies, enhance efficiency,
and create standout features that elevate the user experience. Tailwind CSS, in particular, proved
to be a valuable addition to my skill set, despite some initial challenges.
