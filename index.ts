const url_user:string = "https://jsonplaceholder.typicode.com/users";
const url_posts:string="https://jsonplaceholder.typicode.com/posts";
const url_todo: string = "https://jsonplaceholder.typicode.com/todos";
function getMinPosts(): number {
    const line = process.argv;
    const flag = line.indexOf('min');
    if (flag === -1)
        return 0;
    const minposts = line[flag + 1];
    if (!minposts) {
        console.error("The min requires a value");
        process.exit(1);
    }
    const minPosts = parseInt(minposts, 10);
    if (isNaN(minPosts)) {
        console.error("Enter a valid integer");
        process.exit(1);
    }
    return minPosts;
}
const Minposts: number = getMinPosts();
 export function groupBy<T>(items: T[], keyFn: (item: T) => string): Record<string, T[]> {
    const result: Record<string, T[]> = {};
    for (const item of items) {
        const key = keyFn(item);
        if (!result[key]) {
            result[key] = [];
        }
        result[key]!.push(item);
    }
    return result;
}
interface userAddress {
    street: string;
    city: string;
}
interface APIuser {
    readonly id: number;
    name: string;
    email: string;
    address: userAddress;
}
interface APIpost {
    userId: number;
}
interface APItodo {
    userId: number;
    completed: boolean;
}
interface userReport {
    id: number;
    name: string;
    email: string;
    city: string;
    postCount: number;
    completedTodos: number;
    processTodos: number;
}
async function genReport(users: APIuser[], posts: APIpost[], todos: APItodo[]):Promise<userReport[]> {
    const userposts = groupBy(posts,(post) => post.userId.toString());
    const usertodos = groupBy(todos, (todo) => todo.userId.toString());
    const finalReport: userReport[] = [];
    for (const user of users) {
        const userIdStr = user.id.toString();
        const userPosts = userposts[userIdStr] || [];
        const userTodos = usertodos[userIdStr] || [];
        const completeTodos = userTodos.filter((todo) => todo.completed === true);
        const inprocessTodos = userTodos.filter((todo) => todo.completed === false);

        const report: userReport = {
            id: user.id,
            name: user.name,
            email: user.email,
            city: user.address.city,
            postCount: userPosts.length,
            completedTodos: completeTodos.length,
            processTodos: inprocessTodos.length
        }
        finalReport.push(report);
    }
    
    return finalReport;
}
async function dataFetch(){
    try {
        const [users, posts, todos]  = await Promise.all([
            fetch(`${url_user}`),
            fetch(`${url_posts}`),
            fetch(`${url_todo}`)
        ]); 
        const [Users, Posts, Todos]: [APIuser[], APIpost[], APItodo[]] = await Promise.all([
            users.json(),
            posts.json(),
            todos.json()
        ]);
        const Report: userReport[] = await genReport(Users, Posts, Todos);
        const temp: userReport[] = [...Report].filter((item) => item.postCount >= Minposts);

        const sortedReport: userReport[] = [...Report].sort((a, b) => (a.postCount === b.postCount) ? a.name.localeCompare(b.name) : b.postCount - a.postCount);
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
        const highestTodo = sortedReport.reduce((max, user) => (user.completedTodos > max.completedTodos) ? user : max);
        console.log(`Average Posts Per User:${avgPosts}`);
        console.log(`User With Highest CompletedTodos: ${highestTodo.name}`);
        console.log(`Users with posts equal to or higher than ${Minposts}:`);
        console.table(temp);
    }
    catch (error) {
        console.error(`Error in data fetch. Specific Error: ${error}`);
        process.exit(1);
    }
}
dataFetch();

