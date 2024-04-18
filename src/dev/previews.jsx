import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import App from "../App";
import ProfilePage from "../components/ProfilePage";
import ProfileForm from "../components/ProfileForm";
import Header from "../components/Header";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/App">
                <App/>
            </ComponentPreview>
            <ComponentPreview path="/ProfilePage">
                <ProfilePage/>
            </ComponentPreview>
            <ComponentPreview path="/ProfileForm">
                <ProfileForm/>
            </ComponentPreview>
            <ComponentPreview path="/Header">
                <Header/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews