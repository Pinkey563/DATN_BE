import { IsSwaggerString } from 'src/decorator/swagger.decorator';

export class UpdateUserProfileDto {
  @IsSwaggerString({ default: 'dusainbolt', maxLength: 50 }, false)
  readonly name: string;

  @IsSwaggerString({ maxLength: 50 }, false)
  readonly avatar: string;

  @IsSwaggerString({ maxLength: 50 }, false)
  readonly coverPhoto: string;

  @IsSwaggerString({ maxLength: 200 }, false)
  readonly facebookUrl: string;

  @IsSwaggerString({ maxLength: 200 }, false)
  readonly xUrl: string;

  @IsSwaggerString({ maxLength: 200 }, false)
  readonly linkedinUrl: string;

  @IsSwaggerString({ maxLength: 200 }, false)
  readonly instagramUrl: string;

  @IsSwaggerString({}, false)
  readonly bio: string;
}
