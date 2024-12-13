import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUrl } from "class-validator";

export class ImageDto{
    @ApiProperty({ type: String, description: 'La URL de la imagen' })
    @IsString()
    @IsUrl()
    url: string;

    @ApiProperty({ type: String, description: 'ID único de la imagen' })
    @IsString()
    id: string;
}