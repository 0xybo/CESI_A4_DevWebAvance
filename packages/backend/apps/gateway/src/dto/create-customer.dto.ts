import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum CustomerStatusDto {
    active = 'active',
    inactive = 'inactive',
}

export class CreateCustomerDto {
    @ApiPropertyOptional({ description: 'Customer name / company name', example: 'Acme Corp' })
    @IsOptional()
    @IsString()
    customer_name?: string;

    @ApiPropertyOptional({ description: 'Customer type', example: 'company' })
    @IsOptional()
    @IsString()
    customer_type?: string;

    @ApiPropertyOptional({ description: 'Contact first name', example: 'John' })
    @IsOptional()
    @IsString()
    contact_firstname?: string;

    @ApiPropertyOptional({ description: 'Contact last name', example: 'Doe' })
    @IsOptional()
    @IsString()
    contact_lastname?: string;

    @ApiPropertyOptional({ description: 'Phone number', example: '+33612345678' })
    @IsOptional()
    @IsString()
    phone_number?: string;

    @ApiPropertyOptional({ description: 'Email address', example: 'contact@acme.com' })
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

    @ApiPropertyOptional({ description: 'Customer status', enum: CustomerStatusDto })
    @IsOptional()
    @IsEnum(CustomerStatusDto)
    status?: CustomerStatusDto;
}
