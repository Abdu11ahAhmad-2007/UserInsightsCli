const url_user = "https://jsonplaceholder.typicode.com/users";
const url_posts="https://jsonplaceholder.typicode.com/posts";
const url_todo = "https://jsonplaceholder.typicode.com/todos";
async function dataFetch(){
    try {
        const [users, posts, todos] = await Promise.all([
            fetch(`${url_user}`),
            fetch(`${url_posts}`),
            fetch(`${url_todo}`)
        ]);
        const [Users, Posts, Todos] = await Promise.all([
            users.json(),
            posts.json(),
            todos.json()
        ]);
        const report = Users.map((user) => {
            const postMatch = Posts.filter((post) => post.userId === user.id);
            const completed = Todos.filter((todo) => (todo.userId === user.id && todo.completed === true));
            const process = Todos.filter((todo) => (todo.userId === user.id && todo.completed === false));
            return {
                name: user.name,
                email: user.email,
                city: user.address.city,
                postCount: postMatch.length,
                completedTodos: completed.length,
                processTodos: process.length
            };
        });
        const sortedReport = [...report].sort((a, b) => 
            (a.postCount === b.postCount) ?a.name.localeCompare(b.name) : b.postCount - a.postCount
        );
        console.table(sortedReport);
        const totalPosts = sortedReport.reduce((total, user) => total + user.postCount, 0);
        console.log(`Total No. of Users:${sortedReport.length}`);
        console.log(`Total Post Count:${totalPosts}`);
        const avgPosts = sortedReport.reduce((avg, user, index, arr) => {
            avg += user.postCount;
            if (index === arr.length - 1) {
                return avg / arr.length;
            }
            return avg;
        },0);
        console.log(`Avg No of Posts Per User:${avgPosts}`);
        const highestTodo = sortedReport.reduce((max, user) => (user.completedTodos > max.completedTodos) ? user : max);
        console.log(`User With Highest CompletedTodos:${highestTodo.name}`);
    }
    catch (errror) {
        console.error("Error in data fetch. Double check the URLs");
        process.exit(1);
    }
}
dataFetch();

