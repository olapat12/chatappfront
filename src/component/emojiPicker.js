import React, {useState} from 'react'
import Picker, {SKIN_TONE_MEDIUM_DARK} from 'emoji-picker-react'

const EmojiPicker = ({displayy})=>{

    const [chosenEmoji, setChosenEmoji] = useState(null);

    const onEmojiClick = (event, emojiObject) =>{

        setChosenEmoji(emojiObject);
    }

    return(
        <>
        <div style={{display: displayy}}>
            <Picker onEmojiClick={onEmojiClick} preload={true} skinTone={SKIN_TONE_MEDIUM_DARK} />
             {chosenEmoji && <span> {chosenEmoji.emoji} </span>}
        </div>
        </>
    )
}

export default EmojiPicker;