import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCustomerDto {
    @ApiPropertyOptional({ description: 'Customer name / company name' })
    @IsOptional()
    @IsString()
    customer_name?: string;

    @ApiPropertyOptional({ description: 'Customer type' })
    @IsOptional()
    @IsString()
    customer_type?: string;

    @ApiPropertyOptional({ description: 'Contact first name' })
    @IsOptional()
    @IsString()
    contact_firstname?: string;

    @ApiPropertyOptional({ description: 'Contact last name' })
    @IsOptional()
    @IsString()
    contact_lastname?: string;

    @ApiPropertyOptional({ description: 'Phone number' })
    @IsOptional()
    @IsString()
    phone_number?: string;

    @ApiPropertyOptional({ description: 'Email address' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ description: 'Hub UUID' })
    @IsOptional()
    @IsString()
    hub_id?: string;

    @ApiPropertyOptional({ description: 'Address UUID' })
    @IsOptional()
    @IsString()
    address_id?: string;

    @ApiPropertyOptional({ description: 'Customer status', enum: ['active', 'inactive'] })
    @IsOptional()
    @IsString()
    status?: string;
}
