/**
 *
 * @type {string}
 */
const program = /* glsl */`

vec4 borderColor = vec4( borderColor, borderOpacity );

#ifdef MULTIPLE_FRAMES

vec4 _bwidth = applyMeshScale( borderWidth );

float v = clamp(cornerTL.x / vUnitScale.x, 0.,0.5);
vec2 _cornerTL = vec2( v , clamp( 1.- (cornerTL.x / vUnitScale.y) , 0.5, 1.) );

v = 1. - cornerTR.x;
float vx = clamp( v / vUnitScale.x , 0., 0.5 );

vec2 _cornerTR = vec2(1. -  vx, clamp( 1.- (v / vUnitScale.y) , 0.5, 1.) );

v = clamp(cornerBL.x / vUnitScale.x, 0.,0.5);
vec2 _cornerBL = vec2( v, clamp( cornerBL.x / vUnitScale.y, 0.,0.5 ) );

v = 1. - cornerBR.x;
vx = v / vUnitScale.x;
vec2 _cornerBR = vec2( clamp( 1.-vx, 0.5, 1.0), clamp( v / vUnitScale.y , 0., 0.5));

#else

vec4 _bwidth = borderWidth;
vec2 _cornerTL = cornerTL;
vec2 _cornerTR = cornerTR;
vec2 _cornerBL = cornerBL;
vec2 _cornerBR = cornerBR;

#endif


// This could be tweak to produce more smoothing
float mult = 1.0;

// Step 1 ----------------------------------------------
// Draw the four borders ( top - right - bottom - left )
// Without worrying about radiuses ( Straight boorders )

// Top
float topBorderUVy = 1.0 - _bwidth.x;
if( _bwidth.x > 0.0 && vUvB.y > topBorderUVy )
{

	float w = fwidth( 1.0 - vUvB.y ) * mult;
	float step = smoothstep( topBorderUVy , topBorderUVy + w , vUvB.y );
	diffuseColor = mix( diffuseColor, borderColor, step );

}

// Left
float leftBorderUVx = _bwidth.w;
if( _bwidth.w > 0.0 && vUvB.x < leftBorderUVx )
{

	float w = fwidth( vUvB.x ) * mult ;
	float step = smoothstep( leftBorderUVx , leftBorderUVx - w , vUvB.x );
	diffuseColor = mix( diffuseColor, borderColor, step );

}

// Bottom
float bottomBorderUVy = _bwidth.z;
if( _bwidth.z > 0.0 && vUvB.y < bottomBorderUVy )
{
	float w = fwidth( vUvB.y ) * mult;
	float step = smoothstep( bottomBorderUVy , bottomBorderUVy - w , vUvB.y );
	diffuseColor = mix( diffuseColor, borderColor, step );
}

// Right
float rightBorderUVx = 1.0 - _bwidth.y;
if( _bwidth.y > 0.0 && vUvB.x > rightBorderUVx )
{
	float w = fwidth( 1.0 - vUvB.x ) * mult;
	float step = smoothstep( rightBorderUVx , rightBorderUVx + w , vUvB.x );
	diffuseColor = mix( diffuseColor, borderColor, step );
}


// Step 2 ----------------------------------------------
// Process each corners ( topLeft, topRight, bottomRight, bottomLeft )
// To transparentize outside radiuses
// To draw ellipse border on the corner


// Top Left corner
if( vUvB.x < _cornerTL.x && vUvB.y > _cornerTL.y ) {

		// Only draw border if width is set
		if( _bwidth.w + _bwidth.x > 0.0 ){

			float borderFactor = getEllipticFactor( vUvB, _cornerTL, _cornerTL.x - _bwidth.w,  ( 1.0 - _cornerTL.y ) - _bwidth.x );
			float step = smoothstep( 1.0, 1.0 + fwidth( borderFactor ) * mult, borderFactor );
			diffuseColor = mix( diffuseColor, borderColor, step );

		}

		// Then then radius
		float radiusFactor = getEllipticFactor( vUvB, _cornerTL, _cornerTL.x, 1.0 - _cornerTL.y );
		float alphaStep = smoothstep( 1.0 , 1.0 + fwidth(radiusFactor) * mult , radiusFactor );
		diffuseColor.a = mix( diffuseColor.a, 0.0, alphaStep );

}
// Bottom Left
if( vUvB.x < _cornerBL.x && vUvB.y < _cornerBL.y ) {

		if( _bwidth.w + _bwidth.z > 0.0 ){

			float borderFactor = getEllipticFactor( vUvB, _cornerBL, _cornerBL.x - _bwidth.w,  _cornerBL.y - _bwidth.z );
			float step = smoothstep( 1.0, 1.0 + fwidth( borderFactor ) * mult, borderFactor );
			diffuseColor = mix( diffuseColor, borderColor, step );

		}

		float radiusFactor = getEllipticFactor( vUvB, _cornerBL, _cornerBL.x, _cornerBL.y );
		float alphaStep = smoothstep( 1.0 , 1.0 + fwidth(radiusFactor) * mult , radiusFactor );
		diffuseColor.a = mix( diffuseColor.a, 0.0, alphaStep );

}
// Top Right
if( vUvB.x > _cornerTR.x && vUvB.y > _cornerTR.y ) {

		if( _bwidth.y + _bwidth.x > 0.0 ){

			float borderFactor = getEllipticFactor( vUvB, _cornerTR, ( 1.0 - _cornerTR.x ) - _bwidth.y,  ( 1.0 - _cornerTR.y ) - _bwidth.x );
			float step = smoothstep( 1.0, 1.0 + fwidth( borderFactor ) * mult, borderFactor );
			diffuseColor = mix( diffuseColor, borderColor, step );

		}

		float radiusFactor = getEllipticFactor( vUvB, _cornerTR, 1.0 - _cornerTR.x, 1.0 - _cornerTR.y );
		float alphaStep = smoothstep( 1.0 , 1.0 + fwidth(radiusFactor) * mult , radiusFactor );
		diffuseColor.a = mix( diffuseColor.a, 0.0, alphaStep );

}
// Bottom Right
if( vUvB.x > _cornerBR.x && vUvB.y < _cornerBR.y ) {

		if( _bwidth.y + _bwidth.z > 0.0 ){

			float borderFactor = getEllipticFactor( vUvB, _cornerBR, ( 1.0 - _cornerBR.x ) - _bwidth.y,  _cornerBR.y - _bwidth.z );
			float step = smoothstep( 1.0, 1.0 + fwidth( borderFactor ) * mult, borderFactor );
			diffuseColor = mix( diffuseColor, borderColor, step );

		}

		float radiusFactor = getEllipticFactor( vUvB, _cornerBR, 1.0 - _cornerBR.x, _cornerBR.y );
		float alphaStep = smoothstep( 1.0 , 1.0 + fwidth(radiusFactor) * mult , radiusFactor );
		diffuseColor.a = mix( diffuseColor.a, 0.0, alphaStep );

}

#ifdef MULTIPLE_FRAMES

// diffuseColor = vec4( vUnitScale.x, 0.,0.,diffuseColor.a);

#endif

`;

export default program;
