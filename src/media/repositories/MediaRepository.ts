import { Repository } from "../../framework/repositories/Repository";
import { Media } from "../models/Media";

export class MediaRepository extends Repository<Media> {
    public table = "medias";
}
