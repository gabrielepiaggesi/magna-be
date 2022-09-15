import { Repository } from "../../mgn-framework/repositories/Repository";
import { Media } from "../models/Media";

export class MediaRepository extends Repository<Media> {
    public table = "medias";
}
