import './header.css'

export default function Header(){
    return(
    <header>
        <h2 className='title'>Handled</h2>
        <h2 className='madeForDevs'>Recall your thoughts</h2>
        <nav id='navOnHeader'>
         <button>About</button>
        </nav>
    </header>
    );
}