export default function LogoutForm() {
    return <form method="POST" action="/auth/logout" className="m-0 p-0">
        <button type="submit">Logout</button>
    </form>
}